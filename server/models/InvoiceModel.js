const mongoose = require("mongoose")

InvoiceSchema = mongoose.Schema({
    invoiceId: {
        type: String,
        unique: true,
        required: true
    },
    referenceNumber: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    product: {
        productId: String,
        name: String
    },
    quantity: Number,
    price: Number,
    amount: Number,
    status: {
        type: String,
        enum: ["Paid", "Unpaid"],
        default: "Unpaid"
    },
    invoiceDate: {
        type: Date,
        default: Date.now
    },
    dueDate: Date
}, { timestamps: true });


const Invoice = new mongoose.model("Invoice", InvoiceSchema);

module.exports = Invoice;