const Product = require("../models/ProductModel.js")
const Transaction = require('../models/TransactionModel.js')

const upload = require('../middleware/upload.js')
const { createInvoice } = require("../services/invoiceService.js");
const fs = require('fs')
const readline = require("readline");


// Add single product
const addProduct = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({ error: "Image upload failed" });
        }

        const imagePath = req.file.path.replace(/\\/g, "/");

        const product = await Product.addProduct(req.body, imagePath, req.user._id);

    //    const product = await Product.addProduct(req.body, req.file?.path, req.user._id);

        await Transaction.create({
            userId: req.user._id,
            productId: product._id,
            type: "purchase",
            quantity: product.quantity,
            amount: product.price * product.quantity,
        });

        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// Bulk Upload

const bulkUpload = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({ error: "CSV file is required" });
        }

        const products = [];

        const rl = readline.createInterface({
            input: fs.createReadStream(req.file.path),
            crlfDelay: Infinity
        });

        let headers = [];

        for await (const line of rl) {
            if (!line.trim()) continue;
            const values = line.split(",").map(v => v.trim());

            if (headers.length === 0) {
                headers = values;
                continue;
            }

            let product = {}



            headers.forEach((header, index) => {

                const value = values[index];

                const cleanHeader = header.toLowerCase().replace(/\s+/g, "");

                switch (cleanHeader) {
                    case "productname":
                        product.productName = value;
                        break;
                    case "category":
                        product.category = value;
                        break;
                    case "price":
                        product.price = Number(value);
                        break;
                    case "quantity":
                        product.quantity = Number(value);
                        break;
                    case "unit":
                        product.unit = value;
                        break;
                    case "expirydate":
                        const date = new Date(value);
                        product.expiryDate = isNaN(date.getTime()) ? null : date;
                        break;
                    case "threshold":
                        product.threshold = Number(value);
                        break;
                    case "image":
                        product.image = value; // store path or URL
                        break;
                }
            });



            if (
                product.productName &&
                product.category &&
                !isNaN(product.price) &&
                !isNaN(product.quantity) &&
                product.unit &&
                !isNaN(product.threshold)
            ) {
                product.image = product.image || "uploads/images/default.png";
                products.push(product);
            }
        }

        await Product.insertBulk(products, req.user._id);

        const insertedProducts = await Product.find({
            userId: req.user._id,
            productName: { $in: products.map(p => p.productName) }
        });

        const transactions = insertedProducts.map(p => ({
            userId: req.user._id,
            productId: p._id,
            type: "purchase",
            quantity: p.quantity,
            amount: p.price * p.quantity,
        }));

        await Transaction.insertMany(transactions);

        res.json({ message: "Bulk upload successful", count: products.length });



    } catch (err) {
        res.status(400).json({ error: err.message });
    } finally {
        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }


}

// Get Products

const getProducts = async (req, res) => {
    try {
        const { search, page, limit } = req.query;
        const data = await Product.getProducts(req.user._id, search, +page, +limit);
        res.status(200).json(data);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// Buy Products

const buyProduct = async (req, res) => {
    try {
        const { quantity } = req.body;
        const product = await Product.buyProduct(req.params.id, req.body.quantity, req.user._id);
        const invoice = await createInvoice({
            userId: req.user._id,
            product,
            quantity
        });

        await Transaction.create({
            userId: req.user._id,
            productId: product._id,
            type: "sale",
            quantity,
            amount: product.price * quantity,
        });


        res.json({
            message: "Purchase successful & invoice generated",
            product,
            invoice
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }


}


// Dashboard Summary

// const getDashboardSummary = async (req, res) => {
//     try {
//         const data = await Product.getDashboardSummary(req.user._id);
//         res.json(data);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// }

const getInventorySummary = async (req, res) => {
    try {
        const userId = req.user.id;

        const products = await Product.find({ userId });

        const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);

        // If purchase orders not implemented yet
        const toBeReceived = 0;

        res.json({ totalStock, toBeReceived });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Product Summary
const getProductSummary = async (req, res) => {
    try {
        const userId = req.user.id;

        const products = await Product.find({ userId });

        // If supplier field doesn't exist yet, remove this line
        const supplierCount = new Set(
            products.map(p => p.supplier).filter(Boolean)
        ).size;

        const categoryCount = new Set(
            products.map(p => p.category).filter(Boolean)
        ).size;

        res.json({
            supplierCount,
            categoryCount
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = { addProduct, getProducts, buyProduct, bulkUpload, getInventorySummary, getProductSummary }