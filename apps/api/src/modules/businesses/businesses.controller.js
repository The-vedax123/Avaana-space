import { businessesService } from './businesses.service.js';
import { asyncHandler, ok, created, parseQuery } from '../../utils/http.js';

export const businessesController = {
  list: asyncHandler(async (req, res) => {
    const query = { ...parseQuery(req.query), category: req.query.category, status: req.query.status };
    const { data, meta } = await businessesService.list(query);
    ok(res, data, meta);
  }),

  mine: asyncHandler(async (req, res) => {
    ok(res, await businessesService.mine(req.user.id));
  }),

  getBySlug: asyncHandler(async (req, res) => {
    ok(res, await businessesService.getBySlug(req.params.slug));
  }),

  create: asyncHandler(async (req, res) => {
    created(res, await businessesService.create(req.user.id, req.body));
  }),

  update: asyncHandler(async (req, res) => {
    ok(res, await businessesService.update(req.params.id, req.user, req.body));
  }),

  remove: asyncHandler(async (req, res) => {
    ok(res, await businessesService.remove(req.params.id, req.user));
  }),

  moderate: asyncHandler(async (req, res) => {
    ok(res, await businessesService.moderate(req.params.id, req.user, req.body));
  }),

  follow: asyncHandler(async (req, res) => {
    ok(res, await businessesService.follow(req.params.id, req.user.id));
  }),
};
