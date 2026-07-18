export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'AvaanaSpace API',
    version: '1.0.0',
    description:
      'REST API for AvaanaSpace — Accessible Discovery. A unified platform combining a business directory, marketplace, discovery engine, community spaces, search and admin CRM.',
  },
  servers: [{ url: '/api/v1', description: 'API v1' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'object', properties: { message: { type: 'string' } } },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              user: { type: 'object' },
              accessToken: { type: 'string' },
              refreshToken: { type: 'string' },
            },
          },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/health': { get: { tags: ['System'], summary: 'Health check', security: [], responses: { 200: { description: 'OK' } } } },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new account',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Jane Doe' },
                  email: { type: 'string', example: 'jane@example.com' },
                  password: { type: 'string', example: 'Password123!' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } } },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'admin@avaanaspace.com' },
                  password: { type: 'string', example: 'Password123!' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } } },
      },
    },
    '/auth/me': { get: { tags: ['Auth'], summary: 'Current user', responses: { 200: { description: 'OK' } } } },
    '/businesses': {
      get: { tags: ['Businesses'], summary: 'List businesses', security: [], responses: { 200: { description: 'OK' } } },
      post: { tags: ['Businesses'], summary: 'Register a business', responses: { 201: { description: 'Created' } } },
    },
    '/businesses/{slug}': { get: { tags: ['Businesses'], summary: 'Business by slug', security: [], parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } } },
    '/products': {
      get: { tags: ['Marketplace'], summary: 'List products', security: [], responses: { 200: { description: 'OK' } } },
      post: { tags: ['Marketplace'], summary: 'Create product', responses: { 201: { description: 'Created' } } },
    },
    '/tickets': {
      get: { tags: ['Marketplace'], summary: 'List tickets', responses: { 200: { description: 'OK' } } },
      post: { tags: ['Marketplace'], summary: 'Open a marketplace enquiry (Customer → Admin → Business)', responses: { 201: { description: 'Created' } } },
    },
    '/spaces': {
      get: { tags: ['Spaces'], summary: 'List community spaces', security: [], responses: { 200: { description: 'OK' } } },
      post: { tags: ['Spaces'], summary: 'Create a space', responses: { 201: { description: 'Created' } } },
    },
    '/discovery': { get: { tags: ['Discovery'], summary: 'Discovery overview', security: [], responses: { 200: { description: 'OK' } } } },
    '/discovery/search': { get: { tags: ['Search'], summary: 'Global search', security: [], parameters: [{ name: 'q', in: 'query', schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } } },
    '/notifications': { get: { tags: ['Notifications'], summary: 'List notifications', responses: { 200: { description: 'OK' } } } },
    '/analytics/platform': { get: { tags: ['Analytics'], summary: 'Platform analytics (admin)', responses: { 200: { description: 'OK' } } } },
    '/admin/dashboard': { get: { tags: ['Admin'], summary: 'Admin dashboard (admin)', responses: { 200: { description: 'OK' } } } },
    '/uploads': {
      post: {
        tags: ['Uploads'],
        summary: 'Upload an image (max 5MB)',
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } },
            },
          },
        },
        responses: { 200: { description: 'OK' } },
      },
    },
  },
};
