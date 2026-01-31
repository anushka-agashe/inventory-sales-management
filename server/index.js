require("dotenv").config();

const express = require("express");
const cors = require("cors"); 
const fs = require("fs"); 
const path = require("path"); 

const app = express();

//Port
port = process.env.PORT || 4000;

//DB Connection
require("./db/connection.js");

//Require Routes

const userRoutes = require('./routes/userRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const invoiceRoutes = require("./routes/invoiceRoutes.js");
const transactionRoutes = require("./routes/transactionRoutes");
const statsRoutes = require("./routes/statsRoutes");

//Middleware

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes

app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/invoices",invoiceRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/stats", statsRoutes);


app.listen(port, () => {
    console.log(`Server is running at PORT ${port}`);
});