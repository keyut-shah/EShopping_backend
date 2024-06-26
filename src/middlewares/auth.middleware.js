const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { check, validationResult } = require('express-validator');

const verifyJWT = asyncHandler(async (req, res, next) => {
  console.log("inside my verifyJWT in auth middleware");
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({ msg: 'Invalid access' }); // here please add status code also 

    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ msg: error?.message || "Invalid access token" });

    
  }
});

const validateSignup = [
  check('firstName').notEmpty().withMessage('First name is required'),
  check('lastName').notEmpty().withMessage('Last name is required'),
  check('email').isEmail().withMessage('Enter a valid email address'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  check('phone').notEmpty().withMessage('Phone number is required'),
  check('address.street').notEmpty().withMessage('Street address is required'),
  check('address.city').notEmpty().withMessage('City is required'),
  check('address.state').notEmpty().withMessage('State is required'),
  check('address.zipCode').notEmpty().withMessage('Zip code is required'),
  check('address.country').notEmpty().withMessage('Country is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  verifyJWT,
  validateSignup
};
