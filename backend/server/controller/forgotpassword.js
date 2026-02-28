const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = generateOTP();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP for Password Reset",
    text: `Your OTP is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP sent:", otp);
    res.status(200).json({ message: "OTP sent successfully", otp }); // Remove `otp` in prod
  } catch (error) {
    console.error("Email send failed:", error);
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
});

module.exports = router;
