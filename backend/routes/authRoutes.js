const express = require("express");
const { registerUser, loginUser, getProfile } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Profile route (protected)
router.get("/profile", verifyToken, getProfile);

module.exports = router;
