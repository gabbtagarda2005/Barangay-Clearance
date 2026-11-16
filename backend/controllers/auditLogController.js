const AuditLog = require("../models/AuditLog");

// Get All Audit Logs
const getAllAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("performedBy", "fullName email role")
      .populate("targetResident", "fullName email")
      .sort({ timestamp: -1 });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Audit Logs by Date Range
const getAuditLogsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = {
      timestamp: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };

    const logs = await AuditLog.find(query)
      .populate("performedBy", "fullName email role")
      .populate("targetResident", "fullName email")
      .sort({ timestamp: -1 });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Audit Logs by Action
const getAuditLogsByAction = async (req, res) => {
  try {
    const { action } = req.params;

    const logs = await AuditLog.find({ action })
      .populate("performedBy", "fullName email role")
      .populate("targetResident", "fullName email")
      .sort({ timestamp: -1 });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Audit Logs for Specific User
const getAuditLogsForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const logs = await AuditLog.find({ performedBy: userId })
      .populate("performedBy", "fullName email role")
      .populate("targetResident", "fullName email")
      .sort({ timestamp: -1 });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllAuditLogs,
  getAuditLogsByDateRange,
  getAuditLogsByAction,
  getAuditLogsForUser,
};
