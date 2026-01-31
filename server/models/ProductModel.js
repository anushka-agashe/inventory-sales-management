const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    expiryDate: {
        type: Date
    },
    threshold: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        // required : true,
        default: ""
    },
    totalSold: {
        type: Number,
        default: 0
    },
    totalRevenue: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

// Generate Product ID

ProductSchema.virtual("productId").get(function () {
    return this._id.toString().slice(-6).toUpperCase(); //Returns last 6 characters 
});

// Calculate Stock Status

ProductSchema.virtual("stockStatus").get(function () {

    if (this.quantity === 0) {
        return "Out of stock";
    }

    if (this.quantity <= this.threshold) {
        return "Low stock";
    }

    return "In-stock";
});

ProductSchema.set("toJSON", { virtuals: true });
ProductSchema.set("toObject", { virtuals: true });


// Add Single Product

ProductSchema.statics.addProduct = async function (data, filePath, userId) {
    return await this.create({ ...data, image: filePath, userId });
}

// Add Bulk CSV Product 

ProductSchema.statics.insertBulk = async function (products, userId) {
    const productList = products.map(p => ({ ...p, userId }))
    return await this.insertMany(productList, { ordered: false });
}

// Search and pagination 

ProductSchema.statics.getProducts = async function (userId, search = "", page, limit) {

    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const query = {
        userId,
        $or: [
            { productName: { $regex: search, $options: "i" } }
        ]
    };

    const products = await this.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await this.countDocuments(query);

    return { products, total };
}


// Buy Product

ProductSchema.statics.buyProduct = async function (productId, buyOty, userId) {
    const product = await this.findOne({ _id: productId, userId });

    if (!product) {
        throw Error("Product not found !");
    }

    if (product.quantity < buyOty) {
        throw Error("Insufficient Stock !");
    }
    product.quantity -= buyOty;
    product.totalSold += buyOty;
    product.totalRevenue += product.price * buyOty;

    await product.save();

    return product.toObject();

}

const Product = new mongoose.model("Product", ProductSchema);

module.exports = Product;

