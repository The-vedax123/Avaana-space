export const ROLES = {
  VISITOR: 'visitor',
  USER: 'user',
  BUSINESS_OWNER: 'business_owner',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
};

export const ROLE_RANK = {
  [ROLES.VISITOR]: 0,
  [ROLES.USER]: 1,
  [ROLES.BUSINESS_OWNER]: 2,
  [ROLES.ADMIN]: 3,
  [ROLES.SUPER_ADMIN]: 4,
};

export const STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
};

export const TICKET_STATUS = {
  OPEN: 'open',
  IN_REVIEW: 'in_review',
  FORWARDED_TO_BUSINESS: 'forwarded_to_business',
  BUSINESS_RESPONDED: 'business_responded',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};
