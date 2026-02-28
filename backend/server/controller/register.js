const User = require('../middlwares/models/User');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ status: false, message: "Email already exists" });
    }

    // 🚫 No bcrypt — save the password as is (plain text)
    const user = await User.create({ name, email, password });

    res.status(201).json({
      status: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = register;
