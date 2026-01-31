const jwt = require("jsonwebtoken")

const User = require('../models/UserModel.js')

const authUser = async (req, res, next) => {

    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: "Authorization Token required !" });
    }

    if (!authorization.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Invalid token format !" });
    }

    const token = authorization.split(" ")[1];

    try {
        const { _id } = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findOne({ _id }).select("_id");
        if (!req.user) {
            return res.status(401).json({ error: "User not found !" });
        }
        next();

    } catch (error) {
        res.status(403).json({ error: "Invalid or Expired token !" });
    }
}

module.exports = authUser;