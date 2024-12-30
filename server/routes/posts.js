const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const Post = require('../models/post');
const router = express.Router();
require('dotenv').config();

// Middleware to verify JWT
const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ error: 'Authorization token missing' });
  }

  const formattedToken = token.split(' ')[1];
  jwt.verify(formattedToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.userId = decoded.id; // Attach user ID to request
    next();
  });
};

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and JPG file types are allowed'));
  }
};

const upload = multer({ storage, fileFilter });

// Create a new post
router.post('/', authenticate, upload.single('image'), async (req, res) => {
  const { title, content } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    const newPost = new Post({
      title,
      content,
      image: imagePath,
      author: req.userId,
    });
    await newPost.save();
    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post', details: err.message });
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username');
    res.status(200).json({ posts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts', details: err.message });
  }
});

// Get a single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json({ post });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch the post', details: err.message });
  }
});

// Update a post
router.put('/:id', authenticate, upload.single('image'), async (req, res) => {
  const { title, content } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized to update this post' });
    }

    // Update post fields
    post.title = title || post.title;
    post.content = content || post.content;
    if (imagePath) {
      post.image = imagePath;
    }

    const updatedPost = await post.save();
    res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update post', details: err.message });
  }
});

// Delete a post
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post', details: err.message });
  }
});

module.exports = router;
