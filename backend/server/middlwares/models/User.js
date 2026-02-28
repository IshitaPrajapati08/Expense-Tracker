const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
  settings: {
    theme: { type: String, enum: ['light', 'dark'], default: 'light' }
  },

  password_otp: {
    otp: { type: Number },
    limit: { type: Number, default: 5 },
    last_attmept: { type: Date },
    send_time: { type: Number }
  }
});

// ✅ Export model
const User = mongoose.model('User', userSchema);
module.exports = User;
