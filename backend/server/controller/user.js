const express = require('express');
const router = express.Router();

const register = require('./register');
const login = require('./login');

// User registration
router.post('/register', register);

// User login
router.post('/login', login);

// Forgot password (OTP request)

module.exports = router;
