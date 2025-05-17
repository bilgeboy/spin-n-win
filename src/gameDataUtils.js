export function updateGameDataAfterSpin(
  prevGameData,
  playerType,
  selectedPrize,
  spinCost
) {
  const data = { ...prevGameData };
  const metrics = { ...data[playerType] };

  // עדכון ספינים
  metrics.spins = [
    ...metrics.spins,
    {
      time: Date.now(),
      isWin: selectedPrize.value > 0,
      prize: selectedPrize.label,
      spinCost: spinCost,
    },
  ];

  // עדכון כללי
  metrics.totalSpins += 1;
  metrics.totalSpinCost += spinCost;

  if (selectedPrize.value > 0) {
    metrics.totalWins += 1;
    metrics.winsCount[selectedPrize.label] =
      (metrics.winsCount[selectedPrize.label] || 0) + 1;
  }

  // spendBeforeFirstWin אם זו הזכייה הראשונה
  if (metrics.totalWins === 1) {
    metrics.spendBeforeFirstWin = metrics.totalSpinCost;
  }

  data[playerType] = metrics;
  return data;
}

export function calcRTP(playerSettings) {
  let EV = 0;
  const spinCost = playerSettings.spinCost;
  playerSettings.segments.forEach((segment) => {
    EV += segment.value * segment.probability;
  });
  return ((EV / spinCost) * 100).toFixed(2);
}
