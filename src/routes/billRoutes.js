const { Router } = require('express');
const {
  createBill,
  getAllBills,
  getBillById,
  updateBillStatus,
  deleteBill,
  getBillStats,
} = require('../controllers/billController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { UserRole } = require('../constants/enums');

const router = Router();

// All routes require authentication
router.use(authenticate);

router.route('/').get(getAllBills).post(createBill);

router.get('/stats', getBillStats);

router
  .route('/:id')
  .get(getBillById)
  .delete(authorize(UserRole.ADMIN, UserRole.MANAGER), deleteBill);

router.patch(
  '/:id/status',
  authorize(UserRole.ADMIN, UserRole.MANAGER, UserRole.OFFICER),
  updateBillStatus,
);

module.exports = { router };
