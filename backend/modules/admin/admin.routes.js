const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");
const adminController = require("./admin.controller");

const router = express.Router();

router.get("/dashboard", authMiddleware, roleMiddleware("ADMIN"), adminController.dashboard);

module.exports = router;
