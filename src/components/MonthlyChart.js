import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register chart components ONCE
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Nutrition options
const NUTRIENTS = [
  { key: 'calories', label: 'Calories', color: 'rgba(59, 130, 246, 0.5)', unit: 'kcal' },
  { key: 'protein', label: 'Protein', color: 'rgba(16, 185, 129, 0.5)', unit: 'g' },
  { key: 'carbs', label: 'Carbs', color: 'rgba(251, 191, 36, 0.5)', unit: 'g' },
  { key: 'fats', label: 'Fats', color: 'rgba(239, 68, 68, 0.5)', unit: 'g' },
];

function MonthlyChart({ summary, month, setMonth }) {
  const [selected, setSelected] = useState('calories');

  // Create labels for the month (simple approach)
  const daysInMonth = 31;
  const labels = Array.from(
    { length: daysInMonth },
    (_, i) => `${month}-${String(i + 1).padStart(2, '0')}`
  );

  const data = labels.map(date => summary[date]?.[selected] || 0);
  const nutrient = NUTRIENTS.find(n => n.key === selected);

  return (
    <div className="bg-white p-4 rounded shadow">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <div>
          <label className="mr-2 font-medium">Month:</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border p-1 rounded"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 flex-wrap">
          {NUTRIENTS.map(n => (
            <button
              key={n.key}
              onClick={() => setSelected(n.key)}
              className={`px-3 py-1 rounded font-medium border ${
                selected === n.key
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-100'
              }`}
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: `${nutrient.label} (${nutrient.unit})`,
              data,
              backgroundColor: nutrient.color,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: `Daily ${nutrient.label} (${nutrient.unit})`,
            },
          },
        }}
      />
    </div>
  );
}

export default MonthlyChart;
