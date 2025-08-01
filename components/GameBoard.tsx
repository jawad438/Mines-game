
import React from 'react';
import Tile from './Tile';
import { GameState, TileData } from '../types';

interface GameBoardProps {
  grid: TileData[];
  onTileClick: (index: number) => void;
  gameState: GameState;
}

const GameBoard: React.FC<GameBoardProps> = ({ grid, onTileClick, gameState }) => {
  const isPlaying = gameState === GameState.PLAYING;

  return (
    <div className={`aspect-square grid grid-cols-5 gap-2 p-2 bg-slate-900/50 rounded-xl shadow-inner ${!isPlaying && grid.length > 0 ? 'pointer-events-none' : ''}`}>
      {(grid.length > 0 ? grid : Array(25).fill(null)).map((tile, index) => (
        <Tile
          key={index}
          data={tile}
          onClick={() => onTileClick(index)}
          isInteractive={isPlaying}
        />
      ))}
    </div>
  );
};

export default GameBoard;
