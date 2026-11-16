const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  getAllAuditLogs,
  getAuditLogsByDateRange,
  getAuditLogsByAction,
  getAuditLogsForUser,
} = require("../controllers/auditLogController");

const router = express.Router();

// All routes require authentication and admin access
router.use(authMiddleware);
router.use(roleMiddleware("ADMIN", "SYSADMIN"));

router.get("/", getAllAuditLogs);
router.get("/date-range", getAuditLogsByDateRange);
router.get("/action/:action", getAuditLogsByAction);
router.get("/user/:userId", getAuditLogsForUser);

module.exports = router;
