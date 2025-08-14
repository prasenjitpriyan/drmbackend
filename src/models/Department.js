const { Schema, model } = require('mongoose');

const departmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: 10,
    },
    subdivision: {
      type: String,
      required: true,
      default: 'South Kolkata First Sub Division',
    },
    headOfDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    budget: {
      type: Number,
      required: true,
      min: 0,
    },
    allocatedFunds: {
      type: Number,
      default: 0,
      min: 0,
    },
    spentFunds: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Department = model('Department', departmentSchema);

module.exports = { Department };
