const express = require("express")

const authUser = require("../middleware/userMiddleware.js");

const router = express.Router();

const {getInvoices, getInvoiceDashboardStats, toggleInvoiceStatus, deleteInvoice, getSingleInvoice} = require("../controllers/invoiceController.js")

// Get Invoices
router.get("/", authUser, getInvoices);

// Dashboard Stats
router.get("/dashboard", authUser, getInvoiceDashboardStats);
// Get Single Invoice
router.get("/:invoiceId", authUser, getSingleInvoice);

// Toggle Status
router.patch("/toggle/:invoiceId", authUser, toggleInvoiceStatus);
// Delete Invoice
router.delete("/:invoiceId", authUser, deleteInvoice);


module.exports = router;
