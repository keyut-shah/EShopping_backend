const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// Routes for signup
router.post('/signup', authController.signup);

// Routes for login
router.post('/login', authController.login);

// Routes for password reset
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);

// Route for email verification
router.get('/verify-email', authController.verifyEmail);

module.exports = router;
