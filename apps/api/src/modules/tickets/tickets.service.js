import { db } from '../../db/store.js';
import { ApiError } from '../../utils/apiError.js';
import { ROLES, TICKET_STATUS, ROLE_RANK } from '../../constants/roles.js';
import { paginate } from '../../utils/http.js';
import { businessesRepository } from '../businesses/businesses.repository.js';
import { productsRepository } from '../products/products.repository.js';
import { notificationsService } from '../notifications/notifications.service.js';
import { auditService } from '../admin/audit.service.js';

const isStaff = (role) => ROLE_RANK[role] >= ROLE_RANK[ROLES.ADMIN];
let counter = 1002;

const enrich = (t) => ({
  ...t,
  business: db.businesses.findById(t.businessId),
  product: t.productId ? db.products.findById(t.productId) : null,
  messages: db.ticketMessages.find({ ticketId: t.id }, { sort: 'createdAt', order: 'asc' }),
});

export const ticketsService = {
  /**
   * Customers NEVER message sellers directly. A customer opens a ticket that is
   * routed through Admin. The workflow is:
   *   Customer → Admin → Business → Admin → Customer
   */
  async create(customer, { businessId, productId, subject, message }) {
    const business = await businessesRepository.findById(businessId);
    if (!business) throw ApiError.notFound('Business not found');
    if (productId) {
      const product = await productsRepository.findById(productId);
      if (!product || product.businessId !== businessId) {
        throw ApiError.badRequest('Product does not belong to this business');
      }
    }
    const ticket = db.tickets.insert({
      reference: `AVN-${counter++}`,
      customerId: customer.id,
      businessId,
      productId: productId || null,
      subject,
      status: TICKET_STATUS.OPEN,
      priority: 'normal',
    });
    db.ticketMessages.insert({
      ticketId: ticket.id,
      senderId: customer.id,
      senderRole: customer.role,
      audience: 'admin',
      body: message,
    });
    // Notify all admins for triage.
    const admins = db.users.find({}).filter((u) => isStaff(u.role));
    await Promise.all(
      admins.map((a) =>
        notificationsService.create({
          userId: a.id,
          category: 'marketplace',
          title: `New enquiry ${ticket.reference}`,
          body: subject,
        }),
      ),
    );
    return enrich(ticket);
  },

  async list(actor, query) {
    let items = db.tickets.find({}, { sort: 'createdAt', order: 'desc' });
    if (!isStaff(actor.role)) {
      // Customers see their own; business owners see tickets for their businesses.
      const myBusinesses = db.businesses.find({ ownerId: actor.id }).map((b) => b.id);
      items = items.filter(
        (t) => t.customerId === actor.id || myBusinesses.includes(t.businessId),
      );
    }
    if (query.status) items = items.filter((t) => t.status === query.status);
    const enriched = items.map(enrich);
    return paginate(enriched, query);
  },

  async get(actor, id) {
    const ticket = db.tickets.findById(id);
    if (!ticket) throw ApiError.notFound('Ticket not found');
    const business = db.businesses.findById(ticket.businessId);
    const canView =
      isStaff(actor.role) ||
      ticket.customerId === actor.id ||
      business?.ownerId === actor.id;
    if (!canView) throw ApiError.forbidden('You cannot view this ticket');
    return enrich(ticket);
  },

  /** Admin forwards the enquiry on to the business. */
  async forwardToBusiness(actor, id, body) {
    if (!isStaff(actor.role)) throw ApiError.forbidden('Only admins can forward tickets');
    const ticket = db.tickets.findById(id);
    if (!ticket) throw ApiError.notFound('Ticket not found');
    db.ticketMessages.insert({
      ticketId: id,
      senderId: actor.id,
      senderRole: actor.role,
      audience: 'business',
      body: body || 'Forwarding customer enquiry for your response.',
    });
    const updated = db.tickets.update(id, { status: TICKET_STATUS.FORWARDED_TO_BUSINESS });
    const business = db.businesses.findById(ticket.businessId);
    if (business) {
      await notificationsService.create({
        userId: business.ownerId,
        category: 'marketplace',
        title: `Action needed on ${ticket.reference}`,
        body: 'An enquiry was forwarded to you by AvaanaSpace support.',
      });
    }
    await auditService.record({ actorId: actor.id, action: 'ticket.forward', target: id });
    return enrich(updated);
  },

  /** Business replies to admin (never directly to customer). */
  async businessReply(actor, id, body) {
    const ticket = db.tickets.findById(id);
    if (!ticket) throw ApiError.notFound('Ticket not found');
    const business = db.businesses.findById(ticket.businessId);
    if (business?.ownerId !== actor.id && !isStaff(actor.role)) {
      throw ApiError.forbidden('Only the business can respond here');
    }
    db.ticketMessages.insert({
      ticketId: id,
      senderId: actor.id,
      senderRole: actor.role,
      audience: 'admin',
      body,
    });
    const updated = db.tickets.update(id, { status: TICKET_STATUS.BUSINESS_RESPONDED });
    const admins = db.users.find({}).filter((u) => isStaff(u.role));
    await Promise.all(
      admins.map((a) =>
        notificationsService.create({
          userId: a.id,
          category: 'marketplace',
          title: `Business responded on ${ticket.reference}`,
          body: 'Review and relay the response to the customer.',
        }),
      ),
    );
    return enrich(updated);
  },

  /** Admin relays the response back to the customer and resolves. */
  async replyToCustomer(actor, id, body, resolve = true) {
    if (!isStaff(actor.role)) throw ApiError.forbidden('Only admins can reply to customers');
    const ticket = db.tickets.findById(id);
    if (!ticket) throw ApiError.notFound('Ticket not found');
    db.ticketMessages.insert({
      ticketId: id,
      senderId: actor.id,
      senderRole: actor.role,
      audience: 'customer',
      body,
    });
    const updated = db.tickets.update(id, {
      status: resolve ? TICKET_STATUS.RESOLVED : TICKET_STATUS.IN_REVIEW,
    });
    await notificationsService.create({
      userId: ticket.customerId,
      category: 'marketplace',
      title: `Update on ${ticket.reference}`,
      body: 'AvaanaSpace support has replied to your enquiry.',
    });
    return enrich(updated);
  },

  async close(actor, id) {
    const ticket = db.tickets.findById(id);
    if (!ticket) throw ApiError.notFound('Ticket not found');
    if (!isStaff(actor.role) && ticket.customerId !== actor.id) {
      throw ApiError.forbidden('You cannot close this ticket');
    }
    return enrich(db.tickets.update(id, { status: TICKET_STATUS.CLOSED }));
  },
};
