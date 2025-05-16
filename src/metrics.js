export const initialMetrics = {
  spins: [],
  totalPlayers: 0,
  totalSpins: 0,
  totalSpinCost: 0,
  totalWins: 0,
  winsCount: {},
  totalSessionTime: 0,
  sessionCount: 0,
  retentionTime: 0,
  spendBeforeFirstWin: 0,
  averageSessionTime: function () {
    return this.sessionCount === 0
      ? 0
      : this.totalSessionTime / this.sessionCount;
  },
  winRate: function () {
    return this.totalSpins === 0 ? 0 : this.totalWins / this.totalSpins;
  },
  averageSpinCost: function () {
    return this.totalSpins === 0 ? 0 : this.totalSpinCost / this.totalSpins;
  },
  prizeDistribution: function () {
    const total = Object.values(this.winsCount).reduce((a, b) => a + b, 0);
    if (total === 0) return {};
    const dist = {};
    for (const [prize, count] of Object.entries(this.winsCount)) {
      dist[prize] = count / total;
    }
    return dist;
  },
};
