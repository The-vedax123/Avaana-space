import { businessesRepository } from './businesses.repository.js';
import { usersRepository } from '../users/users.repository.js';
import { db } from '../../db/store.js';
import { ApiError } from '../../utils/apiError.js';
import { ROLES, STATUS, ROLE_RANK } from '../../constants/roles.js';
import { paginate } from '../../utils/http.js';
import { auditService } from '../admin/audit.service.js';
import { notificationsService } from '../notifications/notifications.service.js';

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60);

const isStaff = (role) => ROLE_RANK[role] >= ROLE_RANK[ROLES.ADMIN];

export const businessesService = {
  async create(ownerId, payload) {
    let slug = slugify(payload.name);
    if (await businessesRepository.findBySlug(slug)) slug = `${slug}-${Date.now().toString(36)}`;
    const business = await businessesRepository.create({
      ...payload,
      ownerId,
      slug,
      verified: false,
      status: STATUS.PENDING,
      followers: 0,
      rating: 0,
    });
    // Elevate a plain user to business owner.
    const owner = await usersRepository.findById(ownerId);
    if (owner && owner.role === ROLES.USER) {
      await usersRepository.update(ownerId, { role: ROLES.BUSINESS_OWNER });
    }
    await auditService.record({ actorId: ownerId, action: 'business.create', target: business.id });
    return business;
  },

  async list(query) {
    const filter = {};
    if (query.category) filter.category = query.category;
    // Public listings only see approved businesses unless staff requests otherwise.
    filter.status = query.status || STATUS.APPROVED;
    let items = await businessesRepository.list(filter, { sort: query.sort, order: query.order });
    if (query.search) {
      const q = query.search.toLowerCase();
      items = items.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q),
      );
    }
    return paginate(items, query);
  },

  async getBySlug(slug) {
    const business = await businessesRepository.findBySlug(slug);
    if (!business) throw ApiError.notFound('Business not found');
    const products = db.products
      .find({ businessId: business.id, status: STATUS.APPROVED })
      .sort((a, b) => b.sales - a.sales);
    const owner = usersRepository.publicView(await usersRepository.findById(business.ownerId));
    return { ...business, products, owner };
  },

  async getById(id) {
    const business = await businessesRepository.findById(id);
    if (!business) throw ApiError.notFound('Business not found');
    return business;
  },

  async update(id, actor, patch) {
    const business = await businessesRepository.findById(id);
    if (!business) throw ApiError.notFound('Business not found');
    if (business.ownerId !== actor.id && !isStaff(actor.role)) {
      throw ApiError.forbidden('You can only edit your own business');
    }
    return businessesRepository.update(id, patch);
  },

  async remove(id, actor) {
    const business = await businessesRepository.findById(id);
    if (!business) throw ApiError.notFound('Business not found');
    if (business.ownerId !== actor.id && !isStaff(actor.role)) {
      throw ApiError.forbidden('You can only remove your own business');
    }
    await businessesRepository.softDelete(id);
    await auditService.record({ actorId: actor.id, action: 'business.delete', target: id });
    return { deleted: true };
  },

  async moderate(id, actor, { status, reason }) {
    const business = await businessesRepository.findById(id);
    if (!business) throw ApiError.notFound('Business not found');
    const patch = { status };
    if (status === STATUS.APPROVED) patch.verified = true;
    const updated = await businessesRepository.update(id, patch);
    await auditService.record({
      actorId: actor.id,
      action: `business.${status}`,
      target: id,
      meta: reason ? { reason } : null,
    });
    await notificationsService.create({
      userId: business.ownerId,
      category: 'business',
      title: `Business ${status}`,
      body:
        status === STATUS.APPROVED
          ? `${business.name} was approved and is now live.`
          : `${business.name} status changed to ${status}.${reason ? ` Reason: ${reason}` : ''}`,
    });
    return updated;
  },

  async follow(id, userId) {
    const business = await businessesRepository.findById(id);
    if (!business) throw ApiError.notFound('Business not found');
    const existing = db.follows.findOne({ businessId: id, userId });
    if (existing) {
      db.follows.hardDelete(existing.id);
      const updated = await businessesRepository.update(id, {
        followers: Math.max(0, business.followers - 1),
      });
      return { following: false, followers: updated.followers };
    }
    db.follows.insert({ businessId: id, userId });
    const updated = await businessesRepository.update(id, { followers: business.followers + 1 });
    return { following: true, followers: updated.followers };
  },

  async mine(ownerId) {
    return businessesRepository.listByOwner(ownerId);
  },
};
