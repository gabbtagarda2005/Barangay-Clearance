const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  createClearance,
  getPendingClearances,
  getAllClearances,
  getUserClearances,
  approveClearance,
  rejectClearance,
  recordPayment,
  releaseClearance,
  getRevenueReport,
  getClearanceSummary,
  getClearanceById,
  generateClearancePDF,
} = require("../controllers/clearanceController");

const router = express.Router();

// Public endpoint for landing page usage
router.get("/summary", getClearanceSummary);

// All routes require authentication
router.use(authMiddleware);

// Resident routes
router.post("/", roleMiddleware("RESIDENT"), createClearance);
router.get("/my-clearances", roleMiddleware("RESIDENT"), getUserClearances);

// Staff routes
router.get("/pending", roleMiddleware("STAFF", "ADMIN"), getPendingClearances);
router.get("/staff", roleMiddleware("STAFF", "ADMIN"), getAllClearances);
router.put("/:id/approve", roleMiddleware("STAFF", "ADMIN"), approveClearance);
router.put("/:id/reject", roleMiddleware("STAFF", "ADMIN"), rejectClearance);
router.put("/:id/payment", roleMiddleware("STAFF", "ADMIN"), recordPayment);
router.put("/:id/release", roleMiddleware("STAFF", "ADMIN"), releaseClearance);

// Admin routes
router.get("/", roleMiddleware("ADMIN", "SYSADMIN"), getAllClearances);
router.get("/revenue-report", roleMiddleware("ADMIN", "SYSADMIN"), getRevenueReport);

// Get clearance by ID (Staff and Admin only)
router.get("/:id", roleMiddleware("STAFF", "ADMIN", "SYSADMIN"), getClearanceById);

// Generate PDF for released clearances (Residents can download their own)
router.get("/:id/pdf", authMiddleware, generateClearancePDF);

module.exports = router;
