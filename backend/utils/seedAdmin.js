// Run this once with: node utils/seedAdmin.js
// Creates an admin account so you can access /admin routes.
require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

const run = async () => {
  await connectDB();

  const email = "admin@borrowbox.com";
  const existing = await User.findOne({ email });

  if (existing) {
    console.log("Admin already exists:", email);
    process.exit(0);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("Admin@123", salt);

  await User.create({
    name: "BorrowBox Admin",
    email,
    password: hashedPassword,
    phone: "9999999999",
    location: "Mangalore",
    role: "admin",
  });

  console.log("Admin created successfully");
  console.log("Email:", email);
  console.log("Password: Admin@123");
  process.exit(0);
};

run();
