const User = require('../middlwares/models/User');

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ status: false, message: 'User not found' });
    }

    // Simple match for now — for production, use bcrypt
    if (user.password !== password) {
      return res.status(401).json({ status: false, message: 'Invalid password' });
    }

    res.status(200).json({
      status: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = loginUser;
