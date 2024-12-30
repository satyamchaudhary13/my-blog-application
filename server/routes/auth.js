const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const multer = require("multer");
const path = require("path");
const router = express.Router();
require('dotenv').config();

// Serve static files from the 'uploads' folder
const uploadPath = path.join(__dirname, '../uploads');
router.use('/uploads', express.static(uploadPath));  // Serve static files

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);  // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  },
});

const upload = multer({ storage });

router.post("/register", upload.single("profilePicture"), async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the profile picture path
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profilePicture: req.file ? `/uploads/${req.file.filename}` : null, // Save file path if uploaded
    });

    // Save the user to the database
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Registration failed", details: err });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(403).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, username: user.username, profilePicture: user.profilePicture } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err });
  }
});

module.exports = router;
