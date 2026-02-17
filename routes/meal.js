import express from 'express';
import Meal from '../models/Meal.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// JWT middleware
function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'simple_secret');
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// ✅ ADD MEAL
router.post('/', auth, async (req, res) => {
  try {
    const meal = new Meal({
      user: req.userId,
      ...req.body
    });
    await meal.save();
    res.status(201).json(meal);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET MEALS BY DATE
router.get('/', auth, async (req, res) => {
  try {
    const { date } = req.query;
    const meals = await Meal.find({ user: req.userId, date });
    res.json(meals);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ MONTHLY SUMMARY (MOVE THIS UP)
// Monthly summary: returns calories, protein, carbs, fats per date
router.get('/summary', auth, async (req, res) => {
  try {
    const { month } = req.query; // example: 2026-01
    const meals = await Meal.find({
      user: req.userId,
      date: { $regex: `^${month}` }
    });

    // summary[date] = { calories, protein, carbs, fats }
    const summary = {};
    meals.forEach(meal => {
      if (!summary[meal.date]) {
        summary[meal.date] = {
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0
        };
      }
      summary[meal.date].calories += meal.calories;
      summary[meal.date].protein += meal.protein;
      summary[meal.date].carbs += meal.carbs;
      summary[meal.date].fats += meal.fats;
    });

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ DELETE MEAL (KEEP THIS LAST)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Meal.deleteOne({ _id: req.params.id, user: req.userId });
    res.json({ message: 'Meal deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
