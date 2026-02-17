import mongoose from 'mongoose';

const plannedMealSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  mealType: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'], required: true },
  title: { type: String, required: true },
});

export default mongoose.model('PlannedMeal', plannedMealSchema);
