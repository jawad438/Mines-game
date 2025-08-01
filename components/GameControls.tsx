import React from 'react';
import { GameState } from '../types';

interface GameControlsProps {
  betAmount: number;
  setBetAmount: (value: number) => void;
  mineCount: number;
  setMineCount: (value: number) => void;
  balance: number;
  gameState: GameState;
  onStartGame: () => void;
  onPlayAgain: () => void;
  onCashOut: () => void;
  isCashOutPossible: boolean;
  onBackToSlots: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  betAmount,
  setBetAmount,
  mineCount,
  setMineCount,
  balance,
  gameState,
  onStartGame,
  onCashOut,
  isCashOutPossible,
  onBackToSlots,
}) => {
  const isBettingPhase = gameState === GameState.BETTING;

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setBetAmount(isNaN(value) ? 0 : value);
  };
  
  const setBetToHalf = () => setBetAmount(betAmount/2);
  const setBetToDouble = () => setBetAmount(betAmount*2);
  const setBetToMax = () => setBetAmount(balance);


  return (
    <div className="flex flex-col space-y-4 font-pridi">
      <div>
        <label htmlFor="betAmount" className="block text-sm font-medium text-slate-300 mb-1 font-fira">
          Bet Amount
        </label>
        <div className="relative">
          <input
            type="number"
            id="betAmount"
            value={betAmount}
            onChange={handleBetChange}
            disabled={!isBettingPhase}
            className="w-full bg-slate-900 border-slate-700 border-2 rounded-lg p-2.5 text-white focus:ring-purple-500 focus:border-purple-500 transition disabled:opacity-50"
          />
          <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
            <button onClick={setBetToHalf} disabled={!isBettingPhase} className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded disabled:opacity-50 transition">1/2</button>
            <button onClick={setBetToDouble} disabled={!isBettingPhase} className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded disabled:opacity-50 transition">2x</button>
            <button onClick={setBetToMax} disabled={!isBettingPhase} className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded disabled:opacity-50 transition">Max</button>
          </div>
        </div>
      </div>
      
      <div>
        <label htmlFor="mineCount" className="block text-sm font-medium text-slate-300 mb-1 font-fira">
          Mines ({mineCount})
        </label>
        <input
          type="range"
          id="mineCount"
          min="1"
          max="24"
          value={mineCount}
          onChange={(e) => setMineCount(parseInt(e.target.value, 10))}
          disabled={!isBettingPhase}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
        />
      </div>

      {isBettingPhase ? (
        <button
          onClick={onStartGame}
          className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={betAmount <= 0 || betAmount > balance}
        >
          Bet
        </button>
      ) : (
        <button
          onClick={onCashOut}
          disabled={!isCashOutPossible}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-slate-600 disabled:to-slate-700"
        >
          Cash Out
        </button>
      )}
      <button
        onClick={onBackToSlots}
        className="w-full mt-2 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
      >
        Save & Exit to Slots
      </button>
    </div>
  );
};

export default GameControls;
