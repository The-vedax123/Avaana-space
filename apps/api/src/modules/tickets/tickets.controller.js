import { ticketsService } from './tickets.service.js';
import { asyncHandler, ok, created, parseQuery } from '../../utils/http.js';

export const ticketsController = {
  create: asyncHandler(async (req, res) => {
    created(res, await ticketsService.create(req.user, req.body));
  }),
  list: asyncHandler(async (req, res) => {
    const query = { ...parseQuery(req.query), status: req.query.status };
    const { data, meta } = await ticketsService.list(req.user, query);
    ok(res, data, meta);
  }),
  get: asyncHandler(async (req, res) => {
    ok(res, await ticketsService.get(req.user, req.params.id));
  }),
  forward: asyncHandler(async (req, res) => {
    ok(res, await ticketsService.forwardToBusiness(req.user, req.params.id, req.body.body));
  }),
  businessReply: asyncHandler(async (req, res) => {
    ok(res, await ticketsService.businessReply(req.user, req.params.id, req.body.body));
  }),
  replyCustomer: asyncHandler(async (req, res) => {
    ok(
      res,
      await ticketsService.replyToCustomer(req.user, req.params.id, req.body.body, req.body.resolve),
    );
  }),
  close: asyncHandler(async (req, res) => {
    ok(res, await ticketsService.close(req.user, req.params.id));
  }),
};
