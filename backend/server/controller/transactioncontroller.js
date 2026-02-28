const Transaction = require("../middlwares/models/Transaction");

const addTransaction = async (req, res) => {
  try {
    const { userId, type, amount, description, category, date } = req.body;

    if (!userId || !type || !amount || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const transaction = await Transaction.create({
      userId,
      type,
      amount,
      description,
      category,
      date,
    });

    res.status(201).json({
      message: "Transaction added successfully",
      transaction,
    });
  } catch (error) {
    console.error("Add Transaction Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserTransactions = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const transactions = await Transaction.find({ userId }).sort({ date: -1 });

    res.status(200).json({ transactions });
  } catch (error) {
    console.error("Get Transactions Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addTransaction,
  getUserTransactions,
};
