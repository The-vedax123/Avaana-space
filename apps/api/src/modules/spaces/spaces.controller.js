import { spacesService } from './spaces.service.js';
import { asyncHandler, ok, created, parseQuery } from '../../utils/http.js';

export const spacesController = {
  list: asyncHandler(async (req, res) => {
    const query = { ...parseQuery(req.query), visibility: req.query.visibility };
    const { data, meta } = await spacesService.list(query);
    ok(res, data, meta);
  }),
  create: asyncHandler(async (req, res) => {
    created(res, await spacesService.create(req.user, req.body));
  }),
  getBySlug: asyncHandler(async (req, res) => {
    ok(res, await spacesService.getBySlug(req.params.slug));
  }),
  join: asyncHandler(async (req, res) => {
    ok(res, await spacesService.join(req.user, req.params.id));
  }),
  createPost: asyncHandler(async (req, res) => {
    created(res, await spacesService.createPost(req.user, req.params.id, req.body));
  }),
  listPosts: asyncHandler(async (req, res) => {
    const { data, meta } = await spacesService.listPosts(req.params.id, parseQuery(req.query));
    ok(res, data, meta);
  }),
  likePost: asyncHandler(async (req, res) => {
    ok(res, await spacesService.likePost(req.user, req.params.postId));
  }),
  addComment: asyncHandler(async (req, res) => {
    created(res, await spacesService.addComment(req.user, req.params.postId, req.body));
  }),
  listComments: asyncHandler(async (req, res) => {
    ok(res, await spacesService.listComments(req.params.postId));
  }),
  moderatePost: asyncHandler(async (req, res) => {
    ok(res, await spacesService.moderatePost(req.user, req.params.postId));
  }),
};
