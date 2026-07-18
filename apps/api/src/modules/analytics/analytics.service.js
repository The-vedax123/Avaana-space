import { db } from '../../db/store.js';
import { STATUS, TICKET_STATUS } from '../../constants/roles.js';

const daySeries = (rows, days = 14) => {
  const buckets = {};
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    buckets[d] = 0;
  }
  rows.forEach((r) => {
    const d = String(r.createdAt).slice(0, 10);
    if (d in buckets) buckets[d] += 1;
  });
  return Object.entries(buckets).map(([date, value]) => ({ date, value }));
};

export const analyticsService = {
  async platform() {
    const users = db.users.find({});
    const businesses = db.businesses.find({});
    const products = db.products.find({});
    const tickets = db.tickets.find({});
    return {
      totals: {
        users: users.length,
        businesses: businesses.length,
        approvedBusinesses: businesses.filter((b) => b.status === STATUS.APPROVED).length,
        pendingBusinesses: businesses.filter((b) => b.status === STATUS.PENDING).length,
        products: products.length,
        pendingProducts: products.filter((p) => p.status === STATUS.PENDING).length,
        spaces: db.spaces.count(),
        openTickets: tickets.filter((t) => t.status !== TICKET_STATUS.CLOSED).length,
      },
      growth: {
        users: daySeries(users),
        businesses: daySeries(businesses),
        products: daySeries(products),
      },
      categories: Object.entries(
        businesses.reduce((acc, b) => {
          acc[b.category] = (acc[b.category] || 0) + 1;
          return acc;
        }, {}),
      ).map(([label, value]) => ({ label, value })),
      revenueByProduct: products
        .filter((p) => p.status === STATUS.APPROVED)
        .map((p) => ({ label: p.name, value: Math.round(p.price * p.sales) }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6),
    };
  },

  async forBusiness(businessId) {
    const business = db.businesses.findById(businessId);
    if (!business) return null;
    const products = db.products.find({ businessId });
    const tickets = db.tickets.find({ businessId });
    return {
      business: { id: business.id, name: business.name },
      followers: business.followers,
      rating: business.rating,
      products: products.length,
      totalSales: products.reduce((s, p) => s + p.sales, 0),
      revenue: products.reduce((s, p) => s + p.sales * p.price, 0),
      enquiries: tickets.length,
      salesByProduct: products
        .map((p) => ({ label: p.name, value: p.sales }))
        .sort((a, b) => b.value - a.value),
    };
  },

  async search() {
    const logs = db.searchLogs.find({});
    const counts = logs.reduce((acc, l) => {
      acc[l.query] = (acc[l.query] || 0) + 1;
      return acc;
    }, {});
    return {
      totalSearches: logs.length,
      topQueries: Object.entries(counts)
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10),
      volume: daySeries(logs),
    };
  },

  async community() {
    const spaces = db.spaces.find({});
    return {
      totalSpaces: spaces.length,
      totalMembers: spaces.reduce((s, sp) => s + sp.members, 0),
      totalPosts: db.posts.count(),
      engagement: daySeries(db.posts.find({})),
      topSpaces: [...spaces]
        .sort((a, b) => b.members - a.members)
        .slice(0, 6)
        .map((s) => ({ label: s.name, value: s.members })),
    };
  },
};
