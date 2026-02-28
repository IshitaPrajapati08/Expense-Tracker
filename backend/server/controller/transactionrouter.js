const express = require("express");
const router = express.Router();
const {
  addTransaction,
  getUserTransactions,
} = require("./transactioncontroller"); // Adjust path if controller is elsewhere

// POST: Add a transaction
router.post("/add", addTransaction);

// GET: Fetch all transactions for a user
router.get("/", getUserTransactions);

module.exports = router;
