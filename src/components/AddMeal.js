import React, { useState } from 'react';

function AddMeal({ onAdd, date }) {
  const [mealType, setMealType] = useState('Breakfast');
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    onAdd({
      date,
      mealType,
      foodName,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fats: Number(fats)
    });

    // reset fields
    setFoodName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFats('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow mb-4 flex flex-wrap gap-2 items-end"
    >
      <select
        value={mealType}
        onChange={(e) => setMealType(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="Breakfast">Breakfast</option>
        <option value="Lunch">Lunch</option>
        <option value="Dinner">Dinner</option>
        <option value="Snacks">Snacks</option> {/* ✅ NEW */}
      </select>

      <input
        type="text"
        placeholder="Food Name"
        value={foodName}
        onChange={(e) => setFoodName(e.target.value)}
        className="border p-2 rounded"
        required
      />

      <input
        type="number"
        placeholder="Calories"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
        className="border p-2 rounded"
        required
      />

      <input
        type="number"
        placeholder="Protein (g)"
        value={protein}
        onChange={(e) => setProtein(e.target.value)}
        className="border p-2 rounded"
        required
      />

      <input
        type="number"
        placeholder="Carbs (g)"
        value={carbs}
        onChange={(e) => setCarbs(e.target.value)}
        className="border p-2 rounded"
        required
      />

      <input
        type="number"
        placeholder="Fats (g)"
        value={fats}
        onChange={(e) => setFats(e.target.value)}
        className="border p-2 rounded"
        required
      />

      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Add Meal
      </button>
    </form>
  );
}

export default AddMeal;
