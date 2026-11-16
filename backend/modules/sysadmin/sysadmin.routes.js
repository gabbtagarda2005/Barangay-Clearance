const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");
const sysadminController = require("./sysadmin.controller");

const router = express.Router();

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("SYSADMIN"),
  sysadminController.dashboard
);

module.exports = router;
