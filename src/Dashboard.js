import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { calcRTP } from "./gameDataUtils";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const gameData = location.state?.gameData;

  const [selectedPlayerType, setSelectedPlayerType] = useState("casual");

  if (!gameData) {
    return (
      <div className="text-center mt-20 text-xl">
        No data to display. Go back to the game.
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Game
        </button>
      </div>
    );
  }

  const metrics = gameData[selectedPlayerType];
  const totalSpent = metrics.totalSpinCost;
  const totalEarned = metrics.spins.reduce(
    (sum, spin) => sum + (parseInt(spin.prize) || 0),
    0
  );
  const RTP = calcRTP(metrics.playerSettings[selectedPlayerType]) || 0;
  const biggestWin = Math.max(
    ...metrics.spins.map((spin) => parseInt(spin.prize) || 0),
    0
  );
  const netProfit = totalEarned - totalSpent;

  const balanceHistory = metrics.spins
    .reduce(
      (acc, spin, index) => {
        const prevBalance = acc[index].balance;
        const newBalance =
          prevBalance - spin.spinCost + (parseInt(spin.prize) || 0);
        acc.push({ spin: index + 1, balance: newBalance });
        return acc;
      },
      [{ spin: 0, balance: metrics.firstBalance }]
    )
    .slice(1); // remove initial dummy entry

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        📊 Player KPIs Dashboard
      </h1>

      {/* סוג שחקן */}
      <div className="flex justify-center gap-4 mb-6">
        {["newbie", "casual", "grinder", "whale"].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedPlayerType(type)}
            className={`px-4 py-1 rounded text-sm capitalize font-semibold ${
              selectedPlayerType === type
                ? "bg-green-600 text-white"
                : "bg-gray-300"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* נתונים */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Total Spins" value={metrics.totalSpins} />
        <Card
          title="Total Spent"
          value={`-${totalSpent}`}
          color="text-red-600"
        />
        <Card
          title="Total Earned"
          value={`+${totalEarned}`}
          color="text-green-600"
        />
        <Card title="Biggest Win" value={biggestWin} />
        <Card
          title="Net Profit"
          value={(netProfit >= 0 ? "+" : "") + netProfit}
          color={netProfit >= 0 ? "text-green-600" : "text-red-600"}
          full
        />
        <Card
          title="RTP"
          value={`🎯 Current configuration for this player type has a RTP of: ${RTP}%`}
          full
        />
      </div>

      {/* גרף */}
      <div className="bg-white shadow-md rounded-xl p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4 text-center">
          📈 Balance Over Time
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={balanceHistory}>
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#4f46e5"
              strokeWidth={2}
            />
            <CartesianGrid stroke="#ccc" />
            <XAxis
              dataKey="spin"
              label={{ value: "Spin #", position: "insideBottom", offset: -5 }}
            />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center mt-10">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          🎮 Back to Game
        </button>
      </div>
    </div>
  );
}

// כרטיס סטטיסטיקה
function Card({ title, value, color = "text-gray-800", full = false }) {
  return (
    <div
      className={`bg-white shadow-md rounded-xl p-6 ${
        full ? "md:col-span-2" : ""
      }`}
    >
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
