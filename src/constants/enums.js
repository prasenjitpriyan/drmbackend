const UserRole = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  OFFICER: 'officer',
  CLERK: 'clerk',
  USER: 'user',
};

const BillStatus = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PAID: 'paid',
  CANCELLED: 'cancelled',
};

const Priority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

const BillCategory = {
  INFRASTRUCTURE: 'infrastructure',
  EQUIPMENT: 'equipment',
  SERVICES: 'services',
  SUPPLIES: 'supplies',
  EMERGENCY_RESPONSE: 'emergency_response',
  TRAINING: 'training',
  MAINTENANCE: 'maintenance',
};

const ApprovalAction = {
  SUBMITTED: 'submitted',
  REVIEWED: 'reviewed',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  RETURNED: 'returned',
};

export default {
  UserRole,
  BillStatus,
  Priority,
  BillCategory,
  ApprovalAction,
};
