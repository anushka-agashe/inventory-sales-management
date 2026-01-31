const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const generateOtp = require("../utils/generateOtp.js")

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    resetOtp: {
        type: String,
    },
    otpExpires: {
        type: Date
    }
}, { timestamps: true });


// Signup 
UserSchema.statics.signup = async (firstName, lastName, email, password) => {

    if (!firstName || !lastName || !email || !password) {
        throw Error("All fields are required !");
    }

    const exists = await User.findOne({ email });

    if (exists) {
        throw Error("User already exists !");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.create({ firstName, lastName, email, password: hash });

    return user;
}

// Login
UserSchema.statics.login = async (email, password) => {

    const user = await User.findOne({ email });

    if (!user) {
        throw Error("Incorrect Email !");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error("Incorrect Password !");
    }
    return user;
}

// Send Otp
UserSchema.statics.sendOtp = async (email) => {

    if (!email) {
        throw Error("Email is required !");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw Error("User not found !");
    }

    const otp = generateOtp().toString();;

    user.resetOtp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000 // 10 minutes

    await user.save();

    return otp;

}

// Reset Password

UserSchema.statics.resetPassword = async (email, otp, newpassword) => {

    if (!email || !otp || !newpassword) {
        throw Error("All fields are required !");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw Error("User not found !");
    }

    if (user.resetOtp !== otp.toString()) {
        throw Error("Invalid OTP !");
    }

    if (user.otpExpires < Date.now()) {
        throw Error("OTP Expired !");
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newpassword, salt);

    user.resetOtp = undefined;
    user.otpExpires = undefined;

    await user.save();
}

// Edit Profile

UserSchema.statics.editProfile = async (userId, newFirstName, newLastName, newPassword) => {
    const user = await User.findById({_id :userId });

    if (!user) {
        throw Error("User not found !");
    }

    if (newFirstName) {
        user.firstName = newFirstName;
    }

    if (newLastName) {
        user.lastName = newLastName;
    }

    if (newPassword) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    return user;
}

const User = new mongoose.model("User", UserSchema);

module.exports = User;