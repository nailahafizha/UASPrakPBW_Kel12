const express = require("express");
const router = express.Router();

const submissionController = require("../controllers/submissionController");

router.post("/", submissionController.createSubmission);
router.get("/user/:user_id", submissionController.getUserSubmissions);
router.get("/:id", submissionController.getSubmissionById);

module.exports = router;