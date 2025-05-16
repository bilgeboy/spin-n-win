// Game.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import Wheel from "./Wheel";
import { playerProfiles } from "./playerSegments";
import { initialMetrics } from "./metrics";
import { updateGameDataAfterSpin } from "./gameDataUtils";

export default function Game() {
  const navigate = useNavigate();

  const [spinning, setSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [result, setResult] = useState("");
  const [balance, setBalance] = useState(100);
  // eslint-disable-next-line no-unused-vars
  const [firstBalance, setFirstBalance] = useState(100);
  const [error, setError] = useState("");
  const [spinCost, setSpinCost] = useState(10);
  const [playerType, setPlayerType] = useState("casual");
  const [segments, setSegments] = useState(playerProfiles[playerType]);
  const [gameData, setGameData] = React.useState({
    newbie: { ...initialMetrics },
    casual: { ...initialMetrics },
    grinder: { ...initialMetrics },
    whale: { ...initialMetrics },
  });

  const changePlayerType = (type) => {
    setPlayerType(type);
    const multiplier = spinCost / 10;
    const updatedSegments = playerProfiles[type].map((seg) => ({
      ...seg,
      value: Math.round(seg.value * multiplier),
      label: String(Math.round(seg.value * multiplier)),
    }));
    setSegments(updatedSegments);
  };

  const updateSegmentsForNewCost = (newCost) => {
    const multiplier = newCost / 10;
    const baseSegments = playerProfiles[playerType];

    const updatedSegments = baseSegments.map((seg) => ({
      ...seg,
      value: Math.round(seg.value * multiplier),
      label: String(Math.round(seg.value * multiplier)),
    }));

    setSegments(updatedSegments);
  };

  const pickPrizeIndexByProbability = (segments) => {
    const rand = Math.random();
    let cumulative = 0;

    for (let i = 0; i < segments.length; i++) {
      cumulative += segments[i].probability;
      if (rand < cumulative) return i;
    }
    return segments.length - 1;
  };

  const spinWheel = () => {
    if (spinning) return;

    if (balance < spinCost) {
      setError("אין לך מספיק באלאנס כדי לשחק!");
      return;
    }

    setSpinning(true);
    setError("");
    setBalance((prev) => prev - spinCost);

    const spinStart = performance.now();
    const spinDuration = 3000;
    const extraSpins = 360 * 5;

    const segmentAngle = 360 / segments.length;
    const selectedIndex = pickPrizeIndexByProbability(segments);
    const targetAngle = 360 - (selectedIndex * segmentAngle + segmentAngle / 2);

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
        setResult(`${selectedPrize.label}`);
        setBalance((prev) => prev + selectedPrize.value);

        // --- כאן נעדכן את gameData ---

        setGameData((prevGameData) =>
          updateGameDataAfterSpin(
            prevGameData,
            playerType,
            selectedPrize,
            spinCost
          )
        );
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
          {[10, 100, 1000, 10000].map((cost) => (
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

      <div className="flex gap-4 mt-4">
        <button
          onClick={spinWheel}
          disabled={spinning || balance < spinCost}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 disabled:opacity-50"
        >
          {spinning ? "Spinning..." : "Spin"}
        </button>

        <button
          onClick={() => {
            // ניקוי gameData מכל דבר לא סריאלי
            const serializableGameData = Object.fromEntries(
              Object.entries(gameData).map(([playerType, metrics]) => [
                playerType,
                {
                  spins: metrics.spins,
                  totalSpins: metrics.totalSpins,
                  totalSpinCost: metrics.totalSpinCost,
                  totalWins: metrics.totalWins,
                  winsCount: metrics.winsCount,
                  spendBeforeFirstWin: metrics.spendBeforeFirstWin,
                  firstBalance,
                  // כל שדה נוסף שאתה מוסיף ב־initialMetrics – תכלול כאן
                },
              ])
            );

            navigate("/dashboard", {
              state: { gameData: serializableGameData },
            });
          }}
          className="px-6 py-2 bg-purple-600 text-white rounded-xl shadow hover:bg-purple-700"
        >
          show KPIs Dashboards
        </button>
      </div>

      {result && (
        <div className="mt-6 text-xl font-semibold text-gray-700">
          🎉 You won: <span className="text-indigo-700">{result}</span>
        </div>
      )}
    </div>
  );
}
