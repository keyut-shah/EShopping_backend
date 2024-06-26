const User = require('../models/user.model');

// Get Profile Controller
exports.getProfile = async (req, res) => {
    const user = req.user;
    res.status(200).json(user);
};

// Update Profile Controller


exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone, address, dateOfBirth, profilePicture } = req.body;
        console.log("req body value will b e",req.body)
        // Validate that all required fields are provided
        if (!firstName || !lastName || !phone  || !dateOfBirth) {
            return res.status(400).json({ msg: 'All fields are required' }); 
            
        }

        // Find and update the user with the new information
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { firstName, lastName, phone, address, dateOfBirth, profilePicture },
            { new: true } // Return the updated document
        );

        // If the user is not found, throw an error
        if (!updatedUser) {
            return res.status(404).json({ msg: 'User not found' }); 
        }

        // Return the updated user profile
        res.status(200).json(updatedUser);
    } catch (error) {
        // Handle validation errors from Mongoose
        if (error.name === 'ValidationError') {
            
            return res.status(400).json({ msg: error.message }); 
        }

        // Rethrow other errors
        throw error;
    }
};
