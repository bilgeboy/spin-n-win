import React, { useState } from "react";
import "./index.css";

const prizes = [
  "💰 +100 Coins",
  "🏛️ Tax Cut",
  "🔥 Inflation Hit",
  "🎁 Bonus Round",
  "⛔ Lose Turn",
  "❓ Random Event",
  "💾 Save Bonus",
  "💸 +50 Coins",
];

export default function App() {
  const [spinning, setSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [result, setResult] = useState("");

  const spin = () => {
    if (spinning) return;

    const segmentAngle = 360 / prizes.length;
    const randomIndex = Math.floor(Math.random() * prizes.length);
    const extraSpins = 5 * 360;
    const newAngle = extraSpins + randomIndex * segmentAngle + segmentAngle / 2;

    setSpinning(true);
    setAngle(newAngle);

    setTimeout(() => {
      setResult(prizes[randomIndex]);
      setSpinning(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-pink-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🎡 Spin & Win</h1>

      <div className="relative w-64 h-64 mb-6">
        <div
          className="w-full h-full rounded-full border-[10px] border-white shadow-lg transition-transform duration-[3000ms] ease-out"
          style={{
            transform: `rotate(${angle}deg)`,
            background:
              "conic-gradient(#fbbf24 0% 12.5%, #10b981 12.5% 25%, #3b82f6 25% 37.5%, #f472b6 37.5% 50%, #8b5cf6 50% 62.5%, #f87171 62.5% 75%, #34d399 75% 87.5%, #facc15 87.5% 100%)",
          }}
        ></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[20px] border-l-transparent border-r-transparent border-b-black"></div>
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 disabled:opacity-50"
      >
        {spinning ? "Spinning..." : "Spin"}
      </button>

      {result && (
        <div className="mt-6 text-xl font-semibold text-gray-700">
          🎉 You won: <span className="text-indigo-700">{result}</span>
        </div>
      )}
    </div>
  );
}
