import React, { useState } from "react";
import "./index.css";
import Wheel from "./Wheel";
import { default as defaultSegments } from "./defaultSegments";

export default function App() {
  const [spinning, setSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [result, setResult] = useState("");
  const [balance, setBalance] = useState(100); // באלאנס התחלתי
  const [error, setError] = useState(""); // הודעת שגיאה אם אין מספיק כסף

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

    if (balance < 10) {
      setError("אין לך מספיק באלאנס כדי לשחק!");
      return;
    }

    setSpinning(true);
    setError(""); // איפוס שגיאה

    const spinStart = performance.now();
    const spinDuration = 3000;
    const extraSpins = 360 * 5;

    const segmentAngle = 360 / defaultSegments.length;
    const selectedIndex = pickPrizeIndexByProbability(defaultSegments);
    const randomOffsetWithinSegment = Math.random() * segmentAngle;
    const targetAngle =
      360 - (selectedIndex * segmentAngle + randomOffsetWithinSegment);
    const finalRotation = extraSpins + targetAngle;

    setBalance((prev) => prev - 10); // תשלום מחיר כניסה

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
        const selectedPrize = defaultSegments[selectedIndex];
        setResult(selectedPrize.label);
        setBalance((prev) => prev + selectedPrize.value); // קבלת ערך פרס
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-pink-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🎡 Spin & Win</h1>

      <div className="text-center mb-4">
        <p className="text-xl font-semibold">BALANCE: {balance}</p>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <Wheel angle={angle} segments={defaultSegments} />

      <button
        onClick={spinWheel}
        disabled={spinning || balance < 10}
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
