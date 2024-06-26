const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId:{
    type:String , 
    required:true , 
  },
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
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  dateOfBirth: {
    type: Date
  },
  profilePicture: {
    type: String, // we have to handle it with cloudinary url 
    trim: true
  },  
  role: {
    type: String,
    enum: ['customer', 'seller', 'admin'],
    default: 'customer'
  },
  isVerified: { type: Boolean, default: false },
  verificationToken: {
    type: String,
  },
  verificationTokenExpires: { 
    type: Date,
  },


  refreshToken: {
    type: String,
  },
  // Add any other fields you need for user profile

  // question is does have to add the whishlist and 
  // order properties also  currently not addding will see later on 
}, { timestamps: true });

// save password with hashing
userSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.isPasswordCorrect = async function(password){e
  console.log("inside the password correct function check")
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
      {
          _id: this._id,
          email: this.email,
          firstName: this.firstName,
          fullName: this.fullName
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
  )
}
userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
      {
          _id: this._id,
          
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
  )
}

const User = mongoose.model('User', userSchema);

module.exports = User;

