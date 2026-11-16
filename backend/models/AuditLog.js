const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        "CLEARANCE_CREATED",
        "CLEARANCE_APPROVED",
        "CLEARANCE_REJECTED",
        "CLEARANCE_RELEASED",
        "PAYMENT_RECORDED",
        "USER_CREATED",
        "USER_UPDATED",
        "USER_DELETED",
      ],
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetResident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    targetClearance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clearance",
    },
    details: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);
