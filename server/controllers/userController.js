const sendOtpEmail= require('../utils/emailService.js')
const User = require('../models/UserModel.js')
const createToken = require('../utils/token.js');

// Signup

const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {

        const user = await User.signup(firstName, lastName, email, password);

        // Create token

        const token = createToken(user._id);

        res.status(201).json({
            success: true,
            message: "User registered successfully !",
            token,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        })

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// Login

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);

        // Create token
        const token = createToken(user._id);

        res.status(200).json({
            success: true,
            message: "User loggedin successfully !",
            token,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        })

    } catch (err) {
        res.status(401).json({ error: err.message });
    }



}

// Send OTP

const sendOtp = async (req, res) => {
    const { email } = req.body;
    try {
        const otp = await User.sendOtp(email);

        await sendOtpEmail(email, otp);

        res.status(200).json({
            success: true,
            message: "OTP sent to email (check preview URL in server console)",
            // otp
        })

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
// Reset Password


const resetPassword = async (req, res) => {
    const { email, otp, newpassword } = req.body;

    try {
        await User.resetPassword(email, otp, newpassword);
        res.status(200).json({
            success: true,
            message: "Password reset successfully !"
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// Get Profile

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// Edit Profile

const editProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { firstName, lastName, password } = req.body;

        if (!firstName && !lastName && !password) {
            return res.status(400).json({ error: "Nothing to update" });
        }

        const updatedUser = await User.editProfile(userId, firstName, lastName, password);

        res.status(200).json({
            message: "Profile updated successfully !",
            user: {
                _id: updatedUser._id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email
            }
        });


    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = { signup, login, sendOtp, resetPassword, editProfile, getProfile }