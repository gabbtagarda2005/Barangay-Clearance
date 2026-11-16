const mongoose = require("mongoose");

const clearanceSchema = new mongoose.Schema(
  {
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    purpose: {
      type: String,
      required: true,
      enum: ["Local Employment", "Postal ID", "Bank Requirement", "Travel Abroad", "Business Permit", "Other"],
    },
    status: {
      type: String,
      enum: ["Pending", "For Payment", "Approved", "Rejected", "Released"],
      default: "Pending",
    },
    controlNumber: {
      type: String,
      unique: true,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    paymentDate: {
      type: Date,
    },
    issuedAt: {
      type: Date,
    },
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

// Auto-generate control number on save
clearanceSchema.pre("save", async function (next) {
  if (!this.controlNumber) {
    try {
      const count = await mongoose.model("Clearance").countDocuments();
      const year = new Date().getFullYear();
      this.controlNumber = `BRGY-${year}-${(count + 1).toString().padStart(4, "0")}`;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

module.exports = mongoose.models.Clearance || mongoose.model("Clearance", clearanceSchema);
