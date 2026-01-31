const Transaction = require("../models/TransactionModel");

// group by date format
const groupFormat = (range) => {
  if (range === "yearly") return "%Y-%m";      // 2026-01
  if (range === "monthly") return "%Y-%m-%d";  // 2026-01-31
  return "%Y-%m-%d"; // weekly default
};

const getTransactionSummary = async (req, res) => {
  try {
    const { range } = req.query; 
    const userId = req.user._id;

    const now = new Date();
    let startDate = new Date();

    if (range === "yearly") startDate.setFullYear(now.getFullYear() - 1);
    else if (range === "monthly") startDate.setMonth(now.getMonth() - 1);
    else startDate.setDate(now.getDate() - 7); // weekly default

    const format = groupFormat(range);

    const data = await Transaction.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format, date: "$createdAt" } },
            type: "$type"
          },
          total: { $sum: "$amount" }
        }
      },
      {
        $sort: { "_id.date": 1 }
      }
    ]);

   
    const labelsSet = new Set();
    const salesMap = {};
    const purchaseMap = {};

    data.forEach(d => {
      const date = d._id.date;
      labelsSet.add(date);

      if (d._id.type === "sale") salesMap[date] = d.total;
      if (d._id.type === "purchase") purchaseMap[date] = d.total;
    });

    const labels = Array.from(labelsSet).sort();

    res.json({
      labels,
      sales: labels.map(l => salesMap[l] || 0),
      purchases: labels.map(l => purchaseMap[l] || 0),
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getTransactionSummary };
