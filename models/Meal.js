import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true // YYYY-MM-DD
  },
  mealType: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'], // ✅ added Snacks
    required: true
  },
  foodName: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  protein: {
    type: Number,
    required: true
  },
  carbs: {
    type: Number,
    required: true
  },
  fats: {
    type: Number,
    required: true
  }
});

export default mongoose.model('Meal', mealSchema);
