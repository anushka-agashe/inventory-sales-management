const invoiceService = require("../services/invoiceService.js")
const Invoice = require("../models/InvoiceModel.js")

// Pagination
const getInvoices = async (req, res) => {
    try {

        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 7;
        const total = await Invoice.countDocuments({ userId });
        const invoices = await Invoice.find({ userId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.json({
      invoices,
      totalPages: Math.ceil(total / limit),
    });

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// Dashboard Stats

const getInvoiceDashboardStats = async (req, res) => {
    try {
        const stats = await invoiceService.getInvoiceDashboardStats(req.user.id);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// Toggle Status 
const toggleInvoiceStatus = async (req, res) => {
    try {
        const invoice = await invoiceService.toggleInvoiceStatus(req.params.invoiceId);
        res.json(invoice);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}


// Delete Invoice 
const deleteInvoice = async (req, res) => {

    try {
        await invoiceService.deleteInvoice(req.params.invoiceId);
        res.json({ message: "Invoice deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// Get Single Invoice
const getSingleInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findOne({ invoiceId: req.params.invoiceId });
        res.json(invoice);
    } catch (err) {
        res.status(404).json({ message: "Invoice not found" });
    }

}

module.exports = { getInvoices, getInvoiceDashboardStats, toggleInvoiceStatus, deleteInvoice, getSingleInvoice };

