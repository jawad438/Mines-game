import React from 'react';
import { GameState } from '../types';

interface GameInfoProps {
  balance: number;
  multiplier: number;
  payout: number;
  nextPayout: number;
  gameState: GameState;
}

const GameInfo: React.FC<GameInfoProps> = ({ balance, multiplier, payout, nextPayout, gameState }) => {
  const formatCoins = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 text-center font-fira">
      <div className="flex-1 min-w-[120px]">
        <p className="text-sm text-slate-400">Balance</p>
        <p className="text-xl md:text-2xl font-bold text-white">{formatCoins(balance)}</p>
      </div>
      <div className="flex-1 min-w-[120px]">
        <p className="text-sm text-slate-400">Multiplier</p>
        <p className={`text-xl md:text-2xl font-bold ${gameState === GameState.PLAYING ? 'text-purple-400' : 'text-white'}`}>
          {multiplier.toFixed(2)}x
        </p>
      </div>
      <div className="flex-1 min-w-[120px]">
        <p className="text-sm text-slate-400">Current Payout</p>
        <p className={`text-xl md:text-2xl font-bold ${gameState === GameState.PLAYING ? 'text-emerald-400' : 'text-white'}`}>
          {formatCoins(payout)}
        </p>
      </div>
      {gameState === GameState.PLAYING && (
        <div className="flex-1 min-w-[120px]">
          <p className="text-sm text-slate-400">Next Payout</p>
          <p className="text-xl md:text-2xl font-bold text-cyan-400">
            {formatCoins(nextPayout)}
          </p>
        </div>
      )}
    </div>
  );
};

export default GameInfo;