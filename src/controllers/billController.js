const { Bill } = require('../models/Bill');
const { BillStatus, ApprovalAction } = require('../constants/enums');

const createBill = async (req, res, next) => {
  try {
    const billData = {
      ...req.body,
      submittedBy: req.user._id,
      department: req.user.department._id || req.user.department,
    };

    const bill = await Bill.create(billData);
    await bill.populate(['submittedBy', 'department']);

    res.status(201).json({
      status: 'success',
      data: {
        bill,
      },
      message: 'Bill created successfully',
    });
  } catch (error) {
    next(error);
  }
};

const getAllBills = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, priority, category } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    // For non-admin users, only show bills from their department
    if (req.user.role !== 'admin') {
      filter.department = req.user.department._id || req.user.department;
    }

    const bills = await Bill.find(filter)
      .populate(['submittedBy', 'assignedTo', 'department'])
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const total = await Bill.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      data: {
        bills,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getBillById = async (req, res, next) => {
  try {
    const bill = await Bill.findById(req.params.id).populate([
      'submittedBy',
      'assignedTo',
      'department',
      'approvalHistory.approvedBy',
    ]);

    if (!bill) {
      return res.status(404).json({
        status: 'error',
        message: 'Bill not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        bill,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateBillStatus = async (req, res, next) => {
  try {
    const { status, comments } = req.body;
    const billId = req.params.id;

    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.status(404).json({
        status: 'error',
        message: 'Bill not found',
      });
    }

    // Update bill status
    bill.status = status;

    // Add to approval history
    bill.approvalHistory.push({
      approvedBy: req.user._id,
      action: status,
      comments,
      timestamp: new Date(),
    });

    await bill.save();
    await bill.populate(['submittedBy', 'assignedTo', 'department']);

    res.status(200).json({
      status: 'success',
      data: {
        bill,
      },
      message: 'Bill status updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

const deleteBill = async (req, res, next) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({
        status: 'error',
        message: 'Bill not found',
      });
    }

    await Bill.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Bill deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const getBillStats = async (req, res, next) => {
  try {
    const filter = {};

    // For non-admin users, only show stats from their department
    if (req.user.role !== 'admin') {
      filter.department = req.user.department._id || req.user.department;
    }

    const stats = await Bill.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    const priorityStats = await Bill.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        statusStats: stats,
        priorityStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBill,
  getAllBills,
  getBillById,
  updateBillStatus,
  deleteBill,
  getBillStats,
};
