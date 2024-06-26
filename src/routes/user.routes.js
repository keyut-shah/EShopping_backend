const express = require('express');
const { verifyJWT } = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');

const router = express.Router();

// Routes for getting and updating user profile
router.get('/profile', verifyJWT, userController.getProfile);
router.put('/profile', verifyJWT, userController.updateProfile);

module.exports = router;
