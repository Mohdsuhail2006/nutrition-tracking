import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed
  calorieGoal: { type: Number, default: 2000 }, // Daily calorie goal
  proteinGoal: { type: Number, default: 100 }, // Daily protein goal
});

export default mongoose.model('User', userSchema);
