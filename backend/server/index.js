require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require("cookie-parser");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const getConnection = require('./utils/getConnection');
const googleAuth = require('./middlwares/googleAuth');
const register = require('./controller/register'); 
const userRoutes = require('./controller/user'); // assumes this exports a router

// ✅ NEW: Category route
const CategoryRoutes = require('./controller/CategoryRoutes'); // ✅ ADD THIS LINE
const transactionRoutes = require('./controller/transactionrouter');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: 'secretcode',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// ✅ Existing user routes
app.use('/api', userRoutes);
app.use('/api/transactions', transactionRoutes);

// ✅ NEW: Mount category routes
app.use('/api', CategoryRoutes); // ✅ ADD THIS LINE

// Google Auth Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'], prompt: "select_account" })
);

app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: "http://localhost:5173/Login",
  }),
  (req, res) => {
    res.redirect(`http://localhost:5173/Dashboard?name=${req.user.name}&id=${req.user._id}`);
  }
);

// Auth check route
app.get('/api/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

getConnection();
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port: ${process.env.PORT}`);
});
