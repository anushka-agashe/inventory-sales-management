const express = require("express");
const authUser = require("../middleware/userMiddleware.js");
const upload = require('../middleware/upload.js')

const Product = require("../models/ProductModel.js");

const router = express.Router();
const uploadCSV = require('../middleware/upload.js')
const uploadImage = require('../middleware/uploadImage.js')

// Require Controllers

const {addProduct,bulkUpload , getProducts ,buyProduct, getDashboardSummary,getInventorySummary,getProductSummary} = require("../controllers/productController.js")

router.use(authUser);

//Add product
// router.post("/", upload.single("file"), addProduct);
router.post("/", uploadImage.single("file"), addProduct);

// Bulk Upload
// router.post("/bulkupload", upload.single("file"), bulkUpload);
router.post("/bulkupload", uploadCSV.single("file"), bulkUpload);


// Get Products
router.get("/",getProducts);

// Buy Product
router.post("/buy/:id",buyProduct);

// Dashboard Summary
// router.get("/dashboard",getDashboardSummary)

// Inventory Summary Route
router.get("/inventory-summary",  getInventorySummary);

// Product Summary Route
router.get("/product-summary", getProductSummary);


module.exports = router;