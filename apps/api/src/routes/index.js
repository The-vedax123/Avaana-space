import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import usersRoutes from '../modules/users/users.routes.js';
import businessesRoutes from '../modules/businesses/businesses.routes.js';
import productsRoutes from '../modules/products/products.routes.js';
import spacesRoutes from '../modules/spaces/spaces.routes.js';
import ticketsRoutes from '../modules/tickets/tickets.routes.js';
import discoveryRoutes from '../modules/discovery/discovery.routes.js';
import notificationsRoutes from '../modules/notifications/notifications.routes.js';
import analyticsRoutes from '../modules/analytics/analytics.routes.js';
import adminRoutes from '../modules/admin/admin.routes.js';

const router = Router();

router.get('/', (_req, res) =>
  res.json({
    name: 'AvaanaSpace API',
    version: '1.0.0',
    tagline: 'Accessible Discovery',
    docs: '/api/docs',
    health: '/api/v1/health',
  }),
);

router.get('/health', (_req, res) =>
  res.json({ success: true, status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() }),
);

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/businesses', businessesRoutes);
router.use('/products', productsRoutes);
router.use('/spaces', spacesRoutes);
router.use('/tickets', ticketsRoutes);
router.use('/discovery', discoveryRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/admin', adminRoutes);

export default router;
