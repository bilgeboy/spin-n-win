import React, { useState } from "react";
import "./index.css";
import Wheel from "./Wheel";
import { default as defaultSegments } from "./defaultSegments";
import { playerProfiles } from "./playerSegments";


export default function App() {
  const [spinning, setSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [result, setResult] = useState("");
  const [balance, setBalance] = useState(100); // באלאנס התחלתי
  const [error, setError] = useState(""); // הודעת שגיאה אם אין מספיק כסף
  const [spinCost, setSpinCost] = useState(10);
  const [previousSpinCost, setPreviousSpinCost] = useState(spinCost);
  const [playerType, setPlayerType] = useState("casual");
  const [segments, setSegments] = useState(playerProfiles[playerType]);


  const changePlayerType = (type) => {
  setPlayerType(type);
  setSegments(playerProfiles[type]);
};



const updateSegmentsForNewCost = (newCost) => {
  const multiplier = newCost / previousSpinCost;

  const updatedSegments = segments.map((seg) => ({
    ...seg,
    value: Math.round(seg.value * multiplier),
    label: String(Math.round(seg.value * multiplier)),
  }));

  setSegments(updatedSegments);
  setPreviousSpinCost(newCost);
};


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

  if (balance < spinCost) {
    setError("אין לך מספיק באלאנס כדי לשחק!");
    return;
  }

  setSpinning(true);
  setError("");
  setBalance(prev => prev - spinCost); // מחיר הסיבוב הדינמי

  const spinStart = performance.now();
  const spinDuration = 3000;
  const extraSpins = 360 * 5;

  const segmentAngle = 360 / segments.length;
  const selectedIndex = pickPrizeIndexByProbability(segments);
  const randomOffsetWithinSegment = Math.random() * segmentAngle;
  const targetAngle = 360 - (selectedIndex * segmentAngle + randomOffsetWithinSegment);
  const finalRotation = extraSpins + targetAngle;

  requestAnimationFrame(function animate(time) {
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
      const selectedPrize = segments[selectedIndex];
      const prizeValue = selectedPrize.value * (spinCost / 10); // פרס מוכפל בהתאם למחיר
      setResult(selectedPrize.value);
      setBalance(prev => prev + prizeValue);
    }
  });
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-pink-100">
      <div className="flex gap-2 mb-4">
  {["newbie", "casual", "grinder", "whale"].map((type) => (
    <button
      key={type}
      onClick={() => changePlayerType(type)}
      className={`px-3 py-1 rounded text-sm capitalize ${
        playerType === type ? "bg-green-600 text-white" : "bg-gray-200"
      }`}
    >
      {type}
    </button>
  ))}
</div>

      <h1 className="text-3xl font-bold mb-6 text-gray-800">🎡 Spin & Win</h1>

      <div className="text-center mb-4">
  <p className="text-xl font-semibold">BALANCE: {balance}</p>
  <p className="text-sm mt-1">PRICE FOR SPIN: {spinCost}</p>

  <div className="flex justify-center mt-2 gap-2">
    {[10, 100, 1000, 10000].map(cost => (
      <button
        key={cost}
        onClick={() => {
  setSpinCost(cost);
  updateSegmentsForNewCost(cost);
}}
        className={`px-3 py-1 rounded ${
          spinCost === cost ? "bg-blue-600 text-white" : "bg-gray-200"
        }`}
      >
        {cost}
      </button>
    ))}
  </div>

  {error && <p className="text-red-500 mt-2">{error}</p>}
</div>


      <Wheel angle={angle} segments={segments} spinCost={spinCost} />

      <button
        onClick={spinWheel}
        disabled={spinning || balance < spinCost}
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
