const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    fullName: String,
    birthdate: Date,
    address: String,
    status: {
      type: String,
      enum: ["PENDING", "REVIEW", "APPROVED", "DENIED"],
      default: "PENDING",
    },
    barangayFlag: { type: Boolean, default: false },
    policeStatus: {
      type: String,
      enum: ["NONE", "CLEAR", "WITH_WARRANT"],
      default: "NONE",
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Application || mongoose.model("Application", applicationSchema);
