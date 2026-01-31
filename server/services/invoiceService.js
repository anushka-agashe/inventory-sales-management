const Invoice = require("../models/InvoiceModel.js")
const generateInvoiceId = require("../utils/generateInvoiceId.js")

const createInvoice = async ({ userId, product, quantity }) => {

    const invoiceId = await generateInvoiceId();

    const amount = quantity * product.price;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const invoice = await Invoice.create({
        invoiceId,
        referenceNumber: product._id,
        userId,
        product: {
            // productId: product.productId,
            productId: product._id,
            name: product.productName,
            image: product.image || "uploads/images/default.png"
        },
        quantity,
        price: product.price,
        amount,
        dueDate
    });

    return invoice;
}

// Dashboard Statistics

const getInvoiceDashboardStats = async (userId) => {
    const last7days = new Date();
    last7days.setDate(last7days.getDate() - 7);

    const recentTransactions = await Invoice.countDocuments({
        userId,
        createdAt: { $gte: last7days }
    });

    const totalInvoices = await Invoice.countDocuments({ userId });

    const paidInvoices = await Invoice.find({ userId, status: "Paid" });
    const unpaidInvoices = await Invoice.find({ userId, status: "Unpaid" });

    const totalPaidAmount = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalUnpaidAmount = unpaidInvoices.reduce((sum, inv) => sum + inv.amount, 0);

    const invoices = await Invoice.find({ userId });

  const salesCount = totalInvoices;

    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);


    return {
        recentTransactions,
        totalInvoices,
        totalPaidInvoices: paidInvoices.length,
        totalPaidAmount,
        totalCustomers: paidInvoices.length,
        totalUnpaidAmount,
        totalUnpaidInvoices: unpaidInvoices.length,
        salesCount,
        totalRevenue

    };
};

// Toggle Payment Status

const toggleInvoiceStatus = async (invoiceId) => {
    const invoice = await Invoice.findOne({ invoiceId });
    if (!invoice) {
        throw Error("Invoice not found !");
    }

    // invoice.status = invoice.status === "Paid" ? "Unpaid" : "Paid";
    if (invoice.status === "Unpaid") {
        invoice.status = "Paid";
        await invoice.save();
    }

    await invoice.save();

    return invoice;
}


// Delete Invoice 

const deleteInvoice = async (invoiceId) => {
    return await Invoice.findOneAndDelete({ invoiceId });
}


module.exports = { createInvoice, getInvoiceDashboardStats,toggleInvoiceStatus, deleteInvoice }