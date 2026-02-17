import express from 'express';
import jwt from 'jsonwebtoken';
import PlannedMeal from '../models/PlannedMeal.js';

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

// GET planned meals by date
router.get('/', auth, async (req, res) => {
  try {
    const { date } = req.query;
    const meals = await PlannedMeal.find({
      user: req.userId,
      date,
    });
    res.json(meals);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// ADD planned meal
router.post('/', auth, async (req, res) => {
  try {
    const meal = new PlannedMeal({
      user: req.userId,
      ...req.body,
    });
    await meal.save();
    res.status(201).json(meal);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE planned meal
router.delete('/:id', auth, async (req, res) => {
  try {
    await PlannedMeal.deleteOne({
      _id: req.params.id,
      user: req.userId,
    });
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
