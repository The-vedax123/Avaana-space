import { productsRepository } from './products.repository.js';
import { businessesRepository } from '../businesses/businesses.repository.js';
import { ApiError } from '../../utils/apiError.js';
import { ROLES, STATUS, ROLE_RANK } from '../../constants/roles.js';
import { paginate } from '../../utils/http.js';
import { auditService } from '../admin/audit.service.js';
import { notificationsService } from '../notifications/notifications.service.js';

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60);

const isStaff = (role) => ROLE_RANK[role] >= ROLE_RANK[ROLES.ADMIN];

export const productsService = {
  async create(actor, payload) {
    const business = await businessesRepository.findById(payload.businessId);
    if (!business) throw ApiError.notFound('Business not found');
    if (business.ownerId !== actor.id && !isStaff(actor.role)) {
      throw ApiError.forbidden('You can only add products to your own business');
    }
    let slug = slugify(payload.name);
    if (await productsRepository.findBySlug(slug)) slug = `${slug}-${Date.now().toString(36)}`;
    const product = await productsRepository.create({
      ...payload,
      slug,
      status: STATUS.PENDING,
      rating: 0,
      sales: 0,
    });
    await auditService.record({ actorId: actor.id, action: 'product.create', target: product.id });
    return product;
  },

  async list(query) {
    const filter = { status: query.status || STATUS.APPROVED };
    if (query.category) filter.category = query.category;
    if (query.businessId) filter.businessId = query.businessId;
    let items = await productsRepository.list(filter, { sort: query.sort, order: query.order });
    if (query.search) {
      const q = query.search.toLowerCase();
      items = items.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
      );
    }
    if (query.minPrice) items = items.filter((p) => p.price >= Number(query.minPrice));
    if (query.maxPrice) items = items.filter((p) => p.price <= Number(query.maxPrice));
    return paginate(items, query);
  },

  async getBySlug(slug) {
    const product = await productsRepository.findBySlug(slug);
    if (!product) throw ApiError.notFound('Product not found');
    const business = await businessesRepository.findById(product.businessId);
    return { ...product, business };
  },

  async update(id, actor, patch) {
    const product = await productsRepository.findById(id);
    if (!product) throw ApiError.notFound('Product not found');
    const business = await businessesRepository.findById(product.businessId);
    if (business?.ownerId !== actor.id && !isStaff(actor.role)) {
      throw ApiError.forbidden('You can only edit your own products');
    }
    return productsRepository.update(id, patch);
  },

  async remove(id, actor) {
    const product = await productsRepository.findById(id);
    if (!product) throw ApiError.notFound('Product not found');
    const business = await businessesRepository.findById(product.businessId);
    if (business?.ownerId !== actor.id && !isStaff(actor.role)) {
      throw ApiError.forbidden('You can only remove your own products');
    }
    await productsRepository.softDelete(id);
    return { deleted: true };
  },

  async moderate(id, actor, { status, reason }) {
    const product = await productsRepository.findById(id);
    if (!product) throw ApiError.notFound('Product not found');
    const updated = await productsRepository.update(id, { status });
    const business = await businessesRepository.findById(product.businessId);
    await auditService.record({ actorId: actor.id, action: `product.${status}`, target: id });
    if (business) {
      await notificationsService.create({
        userId: business.ownerId,
        category: 'marketplace',
        title: `Product ${status}`,
        body: `${product.name} was ${status}.${reason ? ` Reason: ${reason}` : ''}`,
      });
    }
    return updated;
  },
};
