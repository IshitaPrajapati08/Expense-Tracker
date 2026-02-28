const express = require('express');
const router = express.Router();

const register = require('./register');
const login = require('./login');
const User = require('../middlwares/models/User');

// Get user settings
router.get('/user/:id/settings', async (req, res, next) => {
	try {
		const user = await User.findById(req.params.id).select('settings');
		if (!user) return res.status(404).json({ status: false, message: 'User not found' });
		res.json({ status: true, settings: user.settings || {} });
	} catch (err) { next(err); }
});

// Update user settings
router.post('/user/:id/settings', async (req, res, next) => {
	try {
		const { theme } = req.body;
		if (theme && !['light','dark'].includes(theme)) return res.status(400).json({ status:false, message: 'Invalid theme' });
		const user = await User.findById(req.params.id);
		if (!user) return res.status(404).json({ status: false, message: 'User not found' });
		user.settings = user.settings || {};
		if (theme) user.settings.theme = theme;
		await user.save();
		res.json({ status: true, settings: user.settings });
	} catch (err) { next(err); }
});

// User registration
router.post('/register', register);

// User login
router.post('/login', login);

// Forgot password (OTP request)

module.exports = router;
