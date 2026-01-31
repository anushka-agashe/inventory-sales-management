const express = require("express");
const authUser = require("../middleware/userMiddleware.js");
const { getTransactionSummary } = require("../controllers/transactionController");

const router = express.Router();

router.use(authUser);

router.get("/summary", getTransactionSummary);

module.exports = router;