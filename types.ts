export enum GameState {
  BETTING = 'BETTING',
  PLAYING = 'PLAYING',
  ENDED = 'ENDED',
}

export enum TileValue {
  GEM = 'GEM',
  MINE = 'MINE',
}

export type TileData = {
  value: TileValue;
  revealed: boolean;
};

export type GameSaveState = {
  balance: number;
  betAmount: number;
  mineCount: number;
  gameState: GameState;
  grid: TileData[];
  revealedSafeTiles: number;
  isLost: boolean;
};

export type SaveSlot = (GameSaveState & {
  lastSaved: string;
}) | null;
