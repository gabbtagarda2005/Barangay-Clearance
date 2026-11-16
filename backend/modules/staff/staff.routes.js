const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");
const staffController = require("./staff.controller");

const router = express.Router();

router.get("/dashboard", authMiddleware, roleMiddleware("STAFF"), staffController.dashboard);

module.exports = router;
