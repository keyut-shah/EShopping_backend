const express = require('express');
const router = express.Router();

// User-related routes
router.use('/user', require('./user.routes.js'));

// Auth-related routes
router.use('/auth', require('./auth.routes.js'));

module.exports = router;
