const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");
const applicationController = require("./application.controller");

const router = express.Router();

// APPLY (Resident)
router.post("/", authMiddleware, roleMiddleware("RESIDENT"), applicationController.apply);

// STAFF REVIEW
router.put(
  "/review/:id",
  authMiddleware,
  roleMiddleware("STAFF"),
  applicationController.review
);

// ADMIN DECISION
router.put(
  "/decision/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  applicationController.decision
);

// POLICE RESPONSE
router.put(
  "/police/:id",
  authMiddleware,
  roleMiddleware("POLICE"),
  applicationController.policeResponse
);

// GET ALL (Admin/Staff)
router.get(
  "/",
  authMiddleware,
  roleMiddleware("STAFF", "ADMIN"),
  applicationController.getAll
);

module.exports = router;
