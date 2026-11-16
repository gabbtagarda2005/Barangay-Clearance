const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const { registerUser, loginUser, getCurrentUser } = require("../controllers/authController");

const router = express.Router();

// Public routes
router.post("/register", uploadMiddleware.single("profilePicture"), registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;
