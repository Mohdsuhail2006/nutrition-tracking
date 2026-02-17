import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'simple_secret'
    );
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// GET goals
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      'calorieGoal proteinGoal'
    );
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// SAVE / UPDATE goals
router.post('/', auth, async (req, res) => {
  try {
    const { calorieGoal, proteinGoal } = req.body;

    await User.findByIdAndUpdate(req.userId, {
      calorieGoal,
      proteinGoal,
    });

    res.json({ message: 'Goals updated' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
