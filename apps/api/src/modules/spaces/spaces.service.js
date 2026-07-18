import { db } from '../../db/store.js';
import { ApiError } from '../../utils/apiError.js';
import { ROLES, ROLE_RANK } from '../../constants/roles.js';
import { paginate } from '../../utils/http.js';
import { usersRepository } from '../users/users.repository.js';

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60);
const isStaff = (role) => ROLE_RANK[role] >= ROLE_RANK[ROLES.ADMIN];

export const spacesService = {
  async list(query) {
    let items = db.spaces.find({}, { sort: 'members', order: 'desc' });
    if (query.visibility) items = items.filter((s) => s.visibility === query.visibility);
    if (query.search) {
      const q = query.search.toLowerCase();
      items = items.filter(
        (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q),
      );
    }
    return paginate(items, query);
  },

  async create(actor, payload) {
    let slug = slugify(payload.name);
    if (db.spaces.findOne({ slug })) slug = `${slug}-${Date.now().toString(36)}`;
    return db.spaces.insert({
      ...payload,
      slug,
      official: isStaff(actor.role) ? Boolean(payload.official) : false,
      ownerId: actor.id,
      members: 1,
    });
  },

  async getBySlug(slug) {
    const space = db.spaces.findOne({ slug });
    if (!space) throw ApiError.notFound('Space not found');
    const posts = db.posts
      .find({ spaceId: space.id }, { sort: 'createdAt', order: 'desc' })
      .map((p) => ({
        ...p,
        author: usersRepository.publicView(db.users.findById(p.authorId)),
      }));
    return { ...space, posts };
  },

  async join(actor, id) {
    const space = db.spaces.findById(id);
    if (!space) throw ApiError.notFound('Space not found');
    const existing = db.follows.findOne({ spaceId: id, userId: actor.id });
    if (existing) {
      db.follows.hardDelete(existing.id);
      const updated = db.spaces.update(id, { members: Math.max(0, space.members - 1) });
      return { joined: false, members: updated.members };
    }
    db.follows.insert({ spaceId: id, userId: actor.id });
    const updated = db.spaces.update(id, { members: space.members + 1 });
    return { joined: true, members: updated.members };
  },

  async createPost(actor, spaceId, { title, body }) {
    const space = db.spaces.findById(spaceId);
    if (!space) throw ApiError.notFound('Space not found');
    return db.posts.insert({
      spaceId,
      authorId: actor.id,
      title,
      body,
      likes: 0,
      commentsCount: 0,
    });
  },

  async listPosts(spaceId, query) {
    const items = db.posts
      .find({ spaceId }, { sort: 'createdAt', order: 'desc' })
      .map((p) => ({ ...p, author: usersRepository.publicView(db.users.findById(p.authorId)) }));
    return paginate(items, query);
  },

  async likePost(actor, postId) {
    const post = db.posts.findById(postId);
    if (!post) throw ApiError.notFound('Post not found');
    const existing = db.likes.findOne({ postId, userId: actor.id });
    if (existing) {
      db.likes.hardDelete(existing.id);
      const updated = db.posts.update(postId, { likes: Math.max(0, post.likes - 1) });
      return { liked: false, likes: updated.likes };
    }
    db.likes.insert({ postId, userId: actor.id });
    const updated = db.posts.update(postId, { likes: post.likes + 1 });
    return { liked: true, likes: updated.likes };
  },

  async addComment(actor, postId, { body }) {
    const post = db.posts.findById(postId);
    if (!post) throw ApiError.notFound('Post not found');
    const comment = db.comments.insert({ postId, authorId: actor.id, body });
    db.posts.update(postId, { commentsCount: post.commentsCount + 1 });
    return { ...comment, author: usersRepository.publicView(db.users.findById(actor.id)) };
  },

  async listComments(postId) {
    return db.comments
      .find({ postId }, { sort: 'createdAt', order: 'asc' })
      .map((c) => ({ ...c, author: usersRepository.publicView(db.users.findById(c.authorId)) }));
  },

  async moderatePost(actor, postId) {
    if (!isStaff(actor.role)) throw ApiError.forbidden('Only moderators can remove posts');
    const post = db.posts.findById(postId);
    if (!post) throw ApiError.notFound('Post not found');
    db.posts.softDelete(postId);
    return { removed: true };
  },
};
