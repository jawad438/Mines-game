
import { TileData, TileValue } from '../types';

function combinations(n: number, k: number): number {
  if (k < 0 || k > n) {
    return 0;
  }
  if (k === 0 || k === n) {
    return 1;
  }
  if (k > n / 2) {
    k = n - k;
  }
  let res = 1;
  for (let i = 1; i <= k; i++) {
    res = res * (n - i + 1) / i;
  }
  return res;
}

export function calculateMultiplier(totalTiles: number, mines: number, revealedSafeTiles: number): number {
  if (revealedSafeTiles === 0) {
    return 1.0;
  }
  const safeTiles = totalTiles - mines;
  if (revealedSafeTiles > safeTiles) {
      return 0; // Should not happen in normal gameplay
  }
  // House edge of 1%
  const houseEdge = 0.99;
  const probability = combinations(safeTiles, revealedSafeTiles) / combinations(totalTiles, revealedSafeTiles);
  const multiplier = houseEdge / probability;
  
  return parseFloat(multiplier.toFixed(4));
}

export function createGameGrid(totalTiles: number, mineCount: number): TileData[] {
  const grid: TileData[] = [];
  for (let i = 0; i < totalTiles; i++) {
    const value = i < mineCount ? TileValue.MINE : TileValue.GEM;
    grid.push({ value, revealed: false });
  }

  // Fisher-Yates shuffle
  for (let i = grid.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [grid[i], grid[j]] = [grid[j], grid[i]];
  }

  return grid;
}
