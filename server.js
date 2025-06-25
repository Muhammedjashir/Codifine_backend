const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Connect to MongoDB
mongoose 
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// POST /users
app.post("/users", async (req, res) => {
  try {
    const { firstName, lastName, email, dob, phone } = req.body;

    if (!firstName || !lastName || !email || !dob || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    log(firstName, lastName, email, dob, phone, "User data received");

    const newUser = new User({ firstName, lastName, email, dob, phone });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error saving user:", error);
    if (error.code === 11000) {
      res.status(409).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});