const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.loginUser);
router.post("/admin-login", authController.loginAdmin);
router.put("/profile/:id", authController.updateProfile);
router.put("/change-password/:id", authController.changePassword);

module.exports = router;