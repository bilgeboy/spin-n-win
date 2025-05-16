import React, { useState } from "react";
import "./index.css";
import Wheel from "./Wheel";

const prizes = ["100", "50", "🔥", "🎁", "⛔", "❓", "💾", "💸"];

const segmentColors = [
  "#fbbf24", // Yellow
  "#10b981", // Green
  "#3b82f6", // Blue
  "#f472b6", // Pink
  "#8b5cf6", // Purple
  "#f87171", // Red
  "#34d399", // Teal
  "#facc15", // Light Yellow
];

export default function App() {
  const [spinning, setSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [result, setResult] = useState("");

  const spinWheel = () => {
    if (spinning) return;

    setSpinning(true);

    const spinStart = performance.now();
    const spinDuration = 3000;
    const extraSpins = 360 * 5;
    const finalOffset = Math.floor(Math.random() * 360);
    const finalRotation = extraSpins + finalOffset;

    const animation = requestAnimationFrame(function animate(time) {
      const elapsed = time - spinStart;
      if (elapsed < spinDuration) {
        const progress = elapsed / spinDuration;
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentAngle = easeOut * finalRotation;
        setAngle(currentAngle);
        requestAnimationFrame(animate);
      } else {
        setAngle(finalRotation);
        setSpinning(false);

        // חישוב האינדקס לפי זווית
        const normalizedAngle = finalRotation % 360;
        const segmentAngle = 360 / prizes.length;
        const index = Math.floor(
          (prizes.length - normalizedAngle / segmentAngle) % prizes.length
        );
        setResult(prizes[index]);
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-pink-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🎡 Spin & Win</h1>

      <Wheel angle={angle} prizes={prizes} colors={segmentColors} />

      <button
        onClick={spinWheel}
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
