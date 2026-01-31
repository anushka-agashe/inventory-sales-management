const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  type: {
    type: String,
    enum: ["sale", "purchase"],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number, // quantity * price at time of transaction
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Transaction", TransactionSchema);