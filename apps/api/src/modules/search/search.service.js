import { db } from '../../db/store.js';
import { STATUS } from '../../constants/roles.js';
import { usersRepository } from '../users/users.repository.js';

const contains = (text, q) => String(text || '').toLowerCase().includes(q);

export const searchService = {
  async global(rawQuery, actorId) {
    const q = String(rawQuery || '').trim().toLowerCase();
    if (actorId && q) db.searchLogs.insert({ userId: actorId, query: q });
    if (!q) return { query: '', businesses: [], products: [], spaces: [], people: [], posts: [] };

    const businesses = db.businesses
      .find({ status: STATUS.APPROVED })
      .filter((b) => contains(b.name, q) || contains(b.category, q) || contains(b.description, q))
      .slice(0, 8);

    const products = db.products
      .find({ status: STATUS.APPROVED })
      .filter((p) => contains(p.name, q) || contains(p.description, q))
      .slice(0, 8);

    const spaces = db.spaces
      .find({})
      .filter((s) => contains(s.name, q) || contains(s.description, q))
      .slice(0, 8);

    const people = db.users
      .find({})
      .filter((u) => contains(u.name, q) || contains(u.bio, q))
      .map(usersRepository.publicView)
      .slice(0, 8);

    const posts = db.posts
      .find({})
      .filter((p) => contains(p.title, q) || contains(p.body, q))
      .slice(0, 8);

    return {
      query: rawQuery,
      counts: {
        businesses: businesses.length,
        products: products.length,
        spaces: spaces.length,
        people: people.length,
        posts: posts.length,
      },
      businesses,
      products,
      spaces,
      people,
      posts,
    };
  },

  async autocomplete(rawQuery) {
    const q = String(rawQuery || '').trim().toLowerCase();
    if (!q) return [];
    const suggestions = new Set();
    db.businesses.find({ status: STATUS.APPROVED }).forEach((b) => {
      if (contains(b.name, q)) suggestions.add(b.name);
      if (contains(b.category, q)) suggestions.add(b.category);
    });
    db.products.find({ status: STATUS.APPROVED }).forEach((p) => {
      if (contains(p.name, q)) suggestions.add(p.name);
    });
    db.spaces.find({}).forEach((s) => {
      if (contains(s.name, q)) suggestions.add(s.name);
    });
    return [...suggestions].slice(0, 8);
  },

  async recent(userId) {
    const seen = new Set();
    return db.searchLogs
      .find({ userId }, { sort: 'createdAt', order: 'desc' })
      .filter((l) => (seen.has(l.query) ? false : seen.add(l.query)))
      .slice(0, 8)
      .map((l) => l.query);
  },
};
