const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); 
const { validationResult } = require('express-validator');
// import {uploadOnCloudinary} from '../utils/cloudinary.js'
const uploadOnCloudinary = require('../utils/cloudinary');
const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");
const { sendEmail } = require('../utils/emailUtils');
const { generateRandomToken } = require('../utils/tokenUtils');

const secretKey = process.env.JWT_SECRET
// Signup method in UserController
module.exports.signup = async (req, res) => {

console.log("insdide the signup")

if (!req.is('multipart/form-data')) {
  return res.status(400).json({ msg: 'Content-Type must be multipart/form-data' });
}


  const { firstName, lastName, email, password, phone, address, dateOfBirth, profilePicture, role ,street , city , state, zipCode , country} = req.body;

  try {
    // Check if the user already exists
    const { nanoid } = await import('nanoid');

    let user = await User.findOne({ email });
    if (user) {
      console.log("user already extist return")
      return res.status(400).json({ msg: 'User already exists' }); // here please add status code also 
    }

console.log("user is null or present ", user)
console.log("street is ", street)
let profileLocalPath = ''
 profileLocalPath = req?.files?.profilePicture?.path;
    console.log("profile local path is", profileLocalPath);

   


 // Upload the profile picture if provided, else set an empty string
 const profileAvatar = profileLocalPath ? await uploadOnCloudinary(profileLocalPath) : { url: '' };
 console.log("profile avatar is", profileAvatar);
    // Create a new user instance
    const userId = nanoid();
    console.log("my user id is ",userId)
    user = new User({
      userId,
      firstName,
      lastName,
      email,
      password, 
      phone,
      'address.street': street,
      'address.city': city,
      'address.state': state,
      'address.zipCode': zipCode,
      'address.country': country,
      dateOfBirth: dateOfBirth,
      profilePicture: profileAvatar.url || '', 
      role,
      verificationToken: jwt.sign({ userId, email }, secretKey, { expiresIn: '1d' }) 

    });
    console.log("new user created ", user)
    // Save the user to the database

    console.log("Secret Key during signup:", secretKey);

    // const verificationToken = jwt.sign({ userId: user.userId, email: user.email }, secretKey, { expiresIn: '1d' });
    // console.log("Generated verificationToken:", verificationToken);

    // user.verificationToken = verificationToken;

    await user.save();
    const verificationLink = `http://localhost:3000/signup/verify-email?token=${user.verificationToken}`;


    await sendEmail(user.email, 'Email Verification', `<p>Please verify your email by clicking on the following link: <a href="${verificationLink}">Verify Email</a></p>`);
 

    // Generate tokens using the user schema methods
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    console.log("my access token is ", accessToken)
    console.log("my refresh token is ", refreshToken)
    // Save the refresh token in the user document
    user.refreshToken = refreshToken;
    await user.save();

    // Return the tokens and user info
    res.status(201).json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        profilePicture: user.profilePicture,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error("Error while creating the user",error.message);
    res.status(500).send('Server Error');
  }
};

module.exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  console.log("Received verificationToken:", token);
  console.log("Secret Key during verification:", secretKey);

  try {
    const decoded = jwt.verify(token, secretKey);
    const user = await User.findOne({ userId: decoded.userId, email: decoded.email, verificationToken: token });
console.log("user is ", user)
    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired token' });
    }

    user.isVerified = true;
    
    user.verificationToken = null; // Clear the verification token
    await user.save();

    res.status(200).json({ msg: 'Email verified successfully' });
  } catch (error) {
    console.error("Error while verifying email", error.message);
    res.status(500).send('Server Error');
  }
};


module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    console.log("my user value inside the login method is ", user)
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res.status(400).json({ msg: 'Email not verified' });
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save the refresh token in the user document
    user.refreshToken = refreshToken;
    await user.save();

    // Return the tokens and user info
    res.status(200).json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        profilePicture: user.profilePicture,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error("Error while logging in", error.message);
    res.status(500).send('Server Error');
  }
};


// controllers/authController.js

module.exports.logout = async (req, res) => {
    
    const { userId } = req.body || req.query || req.params;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.refreshToken = null;
        await user.save();
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





module.exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User with this email does not exist' });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.RESET_PASSWORD_SECRET, { expiresIn: '10m' });
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    await sendEmail(user.email, 'Password Reset', `Click this link to reset your password: <a href="${resetLink}">Reset Password</a>`);

    res.status(200).json({ msg: 'Password reset link sent to your email' });
  } catch (error) {
    res.status(500).send('Server Error');
  }
};


module.exports.resetPassword = async (req, res) => {
  console.log("reset password method call ", req.body)
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);

    console.log("my decoded value is ",decoded)
    const user = await User.findOne({ _id: decoded.userId });
    console.log("my user value is ", user )

    if (!user) {
      return res.status(400).json({ msg: 'Invalid token' });
    }
    
    user.password = newPassword;
    await user.save();

    res.status(200).json({ msg: 'Password reset successfully' });
  } catch (error) {
    res.status(500).send('Server Error');
  }
};




