const { Schema, model } = require('mongoose');
const { BillStatus, Priority, BillCategory, ApprovalAction } = require('../constants/enums');

const attachmentSchema = new Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number, required: true },
  mimetype: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const approvalHistorySchema = new Schema({
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, enum: Object.values(ApprovalAction), required: true },
  comments: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const billSchema = new Schema(
  {
    billNumber: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(BillStatus),
      default: BillStatus.DRAFT,
    },
    priority: {
      type: String,
      enum: Object.values(Priority),
      default: Priority.MEDIUM,
    },
    category: {
      type: String,
      enum: Object.values(BillCategory),
      required: true,
    },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    subdivision: {
      type: String,
      required: true,
      default: 'South Kolkata First Sub Division',
    },
    attachments: [attachmentSchema],
    approvalHistory: [approvalHistorySchema],
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Generate bill number before saving
billSchema.pre('save', async function (next) {
  if (!this.billNumber) {
    const BillModel = model('Bill');
    const count = await BillModel.countDocuments();
    this.billNumber = `DRM-${new Date().getFullYear()}-${(count + 1).toString().padStart(6, '0')}`;
  }
  next();
});

const Bill = model('Bill', billSchema);

module.exports = { Bill };
