// testCreateDB.js
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/expense_tracker')
  .then(() => {
    console.log("✅ MongoDB connected");

    const testUser = new User({ name: "Ishita", email: "ishita@example.com" });
    return testUser.save();
  })
  .then(() => {
    console.log("🎉 User saved, DB & collection created!");
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("❌ Error:", err);
  });
