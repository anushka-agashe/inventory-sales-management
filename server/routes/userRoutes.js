const express = require("express");
const authUser = require("../middleware/userMiddleware");

const User = require("../models/UserModel.js");

const router = express.Router();

//Require Controller

const { signup, login, sendOtp, resetPassword, editProfile, getProfile } = require('../controllers/userController.js')


//Signup
router.post("/signup", signup);
// Login
router.post("/login", login);
// Forget Password
router.post("/forgetpassword", sendOtp);
// Reset Password
router.post("/resetpassword", resetPassword);
// Get Profile
router.get("/profile", authUser, getProfile);
// Edit Profile
router.put("/editprofile", authUser, editProfile);

module.exports = router;