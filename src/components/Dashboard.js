import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddMeal from './AddMeal';
import MonthlyChart from './MonthlyChart';

const API = 'http://localhost:5000';

// Simple weekly plans (frontend-only)
const WEEKLY_PLANS = {
  gain: [
    'High protein breakfast',
    'College lunch',
    'Protein shake',
    'Heavy dinner'
  ],
  loss: [
    'Oats breakfast',
    'Salad lunch',
    'Fruit snack',
    'Light dinner'
  ]
};

function Dashboard({ token, name, onLogout }) {
  const [meals, setMeals] = useState([]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [summary, setSummary] = useState({});
  const [month, setMonth] = useState(() => date.slice(0, 7));

  // Goals
  const [goals, setGoals] = useState({ calorieGoal: 2000, proteinGoal: 100 });
  const [goalInputs, setGoalInputs] = useState({ calorieGoal: 2000, proteinGoal: 100 });

  // Progress
  const [caloriesToday, setCaloriesToday] = useState(0);
  const [proteinToday, setProteinToday] = useState(0);

  // Weekly plan preview
  const [weeklyPlan, setWeeklyPlan] = useState([]);

  useEffect(() => {
    fetchMeals();
    fetchSummary();
    fetchGoals();
    // eslint-disable-next-line
  }, [date, month]);

  const fetchMeals = async () => {
    const res = await axios.get(`${API}/api/meals`, {
      params: { date },
      headers: { Authorization: token },
    });

    setMeals(res.data);

    let cal = 0, prot = 0;
    res.data.forEach(m => {
      cal += m.calories || 0;
      prot += m.protein || 0;
    });
    setCaloriesToday(cal);
    setProteinToday(prot);
  };

  const handleAddMeal = async (meal) => {
    await axios.post(`${API}/api/meals`, meal, {
      headers: { Authorization: token },
    });
    fetchMeals();
    fetchSummary();
  };

  const handleDeleteMeal = async (id) => {
    await axios.delete(`${API}/api/meals/${id}`, {
      headers: { Authorization: token },
    });
    fetchMeals();
    fetchSummary();
  };

  const fetchSummary = async () => {
    const res = await axios.get(`${API}/api/meals/summary`, {
      params: { month },
      headers: { Authorization: token },
    });
    setSummary(res.data);
  };

  const fetchGoals = async () => {
    const res = await axios.get(`${API}/api/goals`, {
      headers: { Authorization: token },
    });
    setGoals(res.data);
    setGoalInputs(res.data);
  };

  const saveGoals = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/api/goals`, goalInputs, {
      headers: { Authorization: token },
    });
    setGoals(goalInputs);
  };

  // ======================
  // CSV DOWNLOAD (MONTHLY)
  // ======================
  const handleDownloadCSV = () => {
    let csv = 'Date,Calories,Protein,Carbs,Fats\n';

    Object.entries(summary).forEach(([date, values]) => {
      csv += `${date},${values.calories || 0},${values.protein || 0},${values.carbs || 0},${values.fats || 0}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `monthly_nutrition_report_${month}.csv`;
    a.click();

    window.URL.revokeObjectURL(url);
  };

  const totalCalories = Object.values(summary).reduce(
    (sum, day) => sum + (day.calories || 0),
    0
  );
  const days = Object.keys(summary).length;
  const avgCalories = days ? Math.round(totalCalories / days) : 0;

  return (
    <div className="max-w-5xl mx-auto p-4">

      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded shadow">
        <h1 className="text-2xl font-bold">Welcome, {name}</h1>
        <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>

      {/* Daily Goals */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold mb-2">Daily Nutrition Goals</h2>
        <form onSubmit={saveGoals} className="flex gap-4 mb-3">
          <input
            type="number"
            placeholder="Daily Calories (kcal)"
            value={goalInputs.calorieGoal}
            onChange={e => setGoalInputs({ ...goalInputs, calorieGoal: +e.target.value })}
            className="border p-2 rounded w-48"
          />
          <input
            type="number"
            placeholder="Daily Protein (g)"
            value={goalInputs.proteinGoal}
            onChange={e => setGoalInputs({ ...goalInputs, proteinGoal: +e.target.value })}
            className="border p-2 rounded w-48"
          />
          <button className="bg-blue-500 text-white px-4 rounded">Save</button>
        </form>

        {/* Progress bars */}
        <div className="mb-2">
          Calories: {caloriesToday} / {goals.calorieGoal}
          <div className="bg-gray-200 h-3 rounded">
            <div
              className="bg-blue-500 h-3 rounded"
              style={{ width: `${Math.min(100, (caloriesToday / goals.calorieGoal) * 100)}%` }}
            />
          </div>
        </div>

        <div>
          Protein: {proteinToday} / {goals.proteinGoal}
          <div className="bg-gray-200 h-3 rounded">
            <div
              className="bg-green-500 h-3 rounded"
              style={{ width: `${Math.min(100, (proteinToday / goals.proteinGoal) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Add Meal */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <label className="mr-2">Date:</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <AddMeal onAdd={handleAddMeal} date={date} />
      </div>

      {/* Daily Meals */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold mb-2">Meals for {date}</h2>
        <ul>
          {meals.map(m => (
            <li key={m._id} className="flex justify-between border-b py-2">
              {m.mealType} – {m.foodName} ({m.calories} kcal)
              <button onClick={() => handleDeleteMeal(m._id)} className="text-red-500">
                Delete
              </button>
            </li>
          ))}
          {meals.length === 0 && <li>No meals logged</li>}
        </ul>
      </div>

      {/* Weekly Plans */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold mb-2">Weekly Meal Plans</h2>
        <button onClick={() => setWeeklyPlan(WEEKLY_PLANS.gain)} className="bg-green-500 text-white px-3 py-1 mr-2 rounded">
          Weight Gain
        </button>
        <button onClick={() => setWeeklyPlan(WEEKLY_PLANS.loss)} className="bg-yellow-500 text-white px-3 py-1 rounded">
          Weight Loss
        </button>

        <ul className="mt-3">
          {weeklyPlan.map((item, i) => (
            <li key={i} className="border-b py-1">{item}</li>
          ))}
        </ul>
      </div>

      {/* Monthly Summary */}
      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">Monthly Nutrition Summary</h2>
          <button
            onClick={handleDownloadCSV}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Download Monthly Report
          </button>
        </div>

        <MonthlyChart summary={summary} month={month} setMonth={setMonth} />
        <div className="mt-2 font-semibold">
          Average Daily Calories: {avgCalories}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
