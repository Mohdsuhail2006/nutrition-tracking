import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    let { name, email, password } = req.body;

    email = email.toLowerCase(); // ✅ IMPORTANT

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase(); // ✅ IMPORTANT

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'simple_secret', // ✅ SAFE FALLBACK
      { expiresIn: '7d' }
    );

    res.json({
      token,
      name: user.name
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
