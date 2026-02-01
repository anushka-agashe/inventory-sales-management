const Invoice = require("../models/InvoiceModel.js");
const Product = require("../models/ProductModel.js");

const getStatistics = async (req, res) => {
  try {
    const userId = req.user._id;

    // TOTAL REVENUE 
    const invoices = await Invoice.find({ userId });
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);

    //  PRODUCTS SOLD 
    const productsSold = invoices.reduce((sum, inv) => sum + inv.quantity, 0);

    //  PRODUCTS IN STOCK 
    const products = await Product.find({ userId });
    const productsInStock = products.reduce((sum, p) => sum + p.quantity, 0);

    res.json({
      totalRevenue,
      productsSold,
      productsInStock
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id;   // use _id consistently
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    // Recent Products (Last 7 Days)
    const recentProducts = await Product.find({
      userId,
      createdAt: { $gte: last7Days },
    });

    const totalQuantity = recentProducts.reduce((sum, p) => sum + (p.quantity || 0), 0);
    const totalAmount = recentProducts.reduce((sum, p) => sum + ((p.quantity || 0) * (p.price || 0)), 0);
    const totalOrders = recentProducts.reduce((sum, p) => sum + (p.totalSold || 0), 0);
    const totalCategories = new Set(recentProducts.map(p => p.category)).size;

    // 🔹 Invoices from last 7 days
    const invoices = await Invoice.find({
      userId,
      createdAt: { $gte: last7Days },
    });

    const productSalesMap = {};

    for (const inv of invoices) {
      if (!inv.product || !inv.product.name) continue;

      const pname = inv.product.name;

      // If product not yet added to map, determine correct image
      if (!productSalesMap[pname]) {
        let imagePath = inv.product.image;

        // Fallback to Product collection if invoice image missing
        if (!imagePath) {
          const productDoc = await Product.findOne({
            userId,
            productName: pname,
          });

          imagePath = productDoc?.image || "uploads/images/default.png";
        }

        productSalesMap[pname] = {
          quantity: 0,
          amount: 0,
          image: imagePath,
        };
      }

      productSalesMap[pname].quantity += inv.quantity || 0;
      productSalesMap[pname].amount += inv.amount || 0;
    }

    //  Top 6 Products by Quantity Sold
    const topProducts = Object.entries(productSalesMap)
      .sort((a, b) => b[1].quantity - a[1].quantity)
      .slice(0, 6)
      .map(([name, data]) => ({
        name,
        quantity: data.quantity,
        amount: data.amount,
        image: data.image, 
      }));

      const topProductsCount = topProducts.length;


    const topRevenue = topProducts.reduce((sum, p) => sum + p.amount, 0);

    // Stock Info
    const outOfStock = await Product.countDocuments({ userId, quantity: 0 });

    const lowStock = await Product.countDocuments({
      userId,
      $expr: {
        $and: [
          { $gt: ["$quantity", 0] },
          { $lte: ["$quantity", "$threshold"] },
        ],
      },
    });

    res.json({
      totalCategories,
      totalQuantity,
      totalAmount,
      totalOrders,
      topRevenue,
      lowStock,
      outOfStock,
      topProducts,
      topProductsCount
    });

  } catch (err) {
    console.error("Dashboard Summary Error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard summary" });
  }
};
module.exports = { getStatistics ,getDashboardSummary  };