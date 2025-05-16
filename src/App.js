import React, { useState } from "react";
import "./index.css";
import Wheel from "./Wheel";

const defaultSegments = [
  { label: "1", color: "#fbbf24", probability: 0.93 },
  { label: "25", color: "#10b981", probability: 0.01 },
  { label: "50", color: "#3b82f6", probability: 0.01 },
  { label: "3", color: "#f472b6", probability: 0.01 },
  { label: "5", color: "#8b5cf6", probability: 0.01 },
  { label: "25", color: "#f87171", probability: 0.01 },
  { label: "50", color: "#34d399", probability: 0.01 },
  { label: "100", color: "#facc15", probability: 0.01 },
];

export default function App() {
  const [spinning, setSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [result, setResult] = useState("");

  const pickPrizeIndexByProbability = (segments) => {
    const rand = Math.random();
    let cumulative = 0;

    for (let i = 0; i < segments.length; i++) {
      cumulative += segments[i].probability;
      if (rand < cumulative) return i;
    }
    return segments.length - 1; // fallback
  };

  const spinWheel = () => {
    if (spinning) return;

    setSpinning(true);

    const spinStart = performance.now();
    const spinDuration = 3000;
    const extraSpins = 360 * 5;

    const segmentAngle = 360 / defaultSegments.length;
    const selectedIndex = pickPrizeIndexByProbability(defaultSegments);

    // נוסיף סטייה אקראית קטנה בתוך הסגמנט
    const randomOffsetWithinSegment = Math.random() * segmentAngle;

    // נחשב את הזווית שבה נמצא האמצע של הסגמנט הנבחר
    const targetAngle =
      360 - (selectedIndex * segmentAngle + randomOffsetWithinSegment);
    const finalRotation = extraSpins + targetAngle;

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
        setResult(defaultSegments[selectedIndex].label);
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-pink-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🎡 Spin & Win</h1>

      <Wheel angle={angle} segments={defaultSegments} />

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
