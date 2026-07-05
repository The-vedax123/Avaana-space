import { productsService } from './products.service.js';
import { asyncHandler, ok, created, parseQuery } from '../../utils/http.js';

export const productsController = {
  list: asyncHandler(async (req, res) => {
    const query = {
      ...parseQuery(req.query),
      category: req.query.category,
      businessId: req.query.businessId,
      status: req.query.status,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
    };
    const { data, meta } = await productsService.list(query);
    ok(res, data, meta);
  }),
  getBySlug: asyncHandler(async (req, res) => {
    ok(res, await productsService.getBySlug(req.params.slug));
  }),
  create: asyncHandler(async (req, res) => {
    created(res, await productsService.create(req.user, req.body));
  }),
  update: asyncHandler(async (req, res) => {
    ok(res, await productsService.update(req.params.id, req.user, req.body));
  }),
  remove: asyncHandler(async (req, res) => {
    ok(res, await productsService.remove(req.params.id, req.user));
  }),
  moderate: asyncHandler(async (req, res) => {
    ok(res, await productsService.moderate(req.params.id, req.user, req.body));
  }),
};
