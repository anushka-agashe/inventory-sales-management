const express = require("express");
const router = express.Router();

const { getStatistics , getDashboardSummary } = require("../controllers/statsController.js");
const authUser =require('../middleware/userMiddleware.js')

router.get("/statistics", authUser, getStatistics);
router.get("/summary", authUser, getDashboardSummary);

module.exports = router;