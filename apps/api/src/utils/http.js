export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const ok = (res, data, meta) =>
  res.status(200).json({ success: true, data, ...(meta ? { meta } : {}) });

export const created = (res, data) => res.status(201).json({ success: true, data });

export const noContent = (res) => res.status(204).send();

/**
 * Parse pagination + sorting + generic filters from the query string.
 */
export const parseQuery = (query = {}) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const sort = query.sort || 'createdAt';
  const order = String(query.order || 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc';
  const search = query.q ? String(query.q).trim() : '';
  return { page, limit, sort, order, search, offset: (page - 1) * limit };
};

export const paginate = (items, { page, limit }) => {
  const total = items.length;
  const start = (page - 1) * limit;
  const data = items.slice(start, start + limit);
  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      hasNext: start + limit < total,
      hasPrev: page > 1,
    },
  };
};
