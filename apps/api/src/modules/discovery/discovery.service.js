import { db } from '../../db/store.js';
import { STATUS } from '../../constants/roles.js';

const approvedBusinesses = () => db.businesses.find({ status: STATUS.APPROVED });
const approvedProducts = () => db.products.find({ status: STATUS.APPROVED });

export const discoveryService = {
  async overview() {
    const businesses = approvedBusinesses();
    const products = approvedProducts();
    const spaces = db.spaces.find({});
    const now = Date.now();
    const isRecent = (d) => now - new Date(d).getTime() < 1000 * 60 * 60 * 24 * 14;

    return {
      trending: [...businesses].sort((a, b) => b.followers - a.followers).slice(0, 6),
      featured: businesses.filter((b) => b.verified).slice(0, 6),
      newBusinesses: businesses.filter((b) => isRecent(b.createdAt)).slice(0, 6),
      products: [...products].sort((a, b) => b.sales - a.sales).slice(0, 8),
      communities: [...spaces].sort((a, b) => b.members - a.members).slice(0, 6),
      recommended: [...businesses].sort((a, b) => b.rating - a.rating).slice(0, 6),
      popular: [...products].sort((a, b) => b.rating - a.rating).slice(0, 8),
      nearby: businesses.slice(0, 6),
    };
  },
};
