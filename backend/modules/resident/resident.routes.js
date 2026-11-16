const express = require("express");
const residentController = require("./resident.controller");

const router = express.Router();

// REGISTER
router.post("/register", residentController.register);

// LOGIN
router.post("/login", residentController.login);

module.exports = router;
