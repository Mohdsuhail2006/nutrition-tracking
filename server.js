import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';


import authRoutes from './routes/auth.js';
import mealRoutes from './routes/meal.js';
import goalsRoutes from './routes/goals.js';
import plannedMealRoutes from './routes/plannedMeal.js';

dotenv.config(); // ✅ MUST be before using env vars

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/plannedMeals', plannedMealRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) =>
    console.error('MongoDB connection error:', err)
  );
