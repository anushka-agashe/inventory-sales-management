const Invoice = require("../models/InvoiceModel.js")

async function generateInvoiceId() {
    const lastInvoice = await Invoice.findOne({})
    .sort({ createdAt: -1 })
    .select("invoiceId");

  if (!lastInvoice) return "INV-1001";

  const lastNumber = parseInt(lastInvoice.invoiceId.split("-")[1], 10);
  const newNumber = lastNumber + 1;

  return `INV-${newNumber}`;
}

module.exports = generateInvoiceId;