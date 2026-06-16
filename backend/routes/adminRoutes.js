const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

router.get("/dashboard", adminController.getDashboardStats);
router.get("/submissions", adminController.getAllSubmissions);
router.put("/submissions/:id/status", adminController.updateSubmissionStatus);

module.exports = router;