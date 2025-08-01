import React from 'react';
import { SaveSlot } from '../types';

interface SaveSlotsProps {
  slots: SaveSlot[];
  onLoadSlot: (index: number) => void;
  onDeleteSlot: (index: number) => void;
}

const SaveSlots: React.FC<SaveSlotsProps> = ({ slots, onLoadSlot, onDeleteSlot }) => {

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this save slot? This action cannot be undone.')) {
      onDeleteSlot(index);
    }
  };

  const formatCoins = (amount: number) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white">
      <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 font-raleway mb-8 text-center">
        Virtual Mines
      </h1>
      <h2 className="text-2xl font-bold font-raleway mb-8">Select a Save Slot</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full max-w-7xl">
        {slots.map((slot, index) => (
          <div key={index} className="bg-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-lg ring-1 ring-slate-700">
            <h3 className="text-xl font-bold font-raleway border-b border-slate-700 pb-2 mb-3">Slot {index + 1}</h3>
            {slot ? (
              <div className="flex flex-col flex-grow justify-between">
                <div className="font-fira text-sm space-y-1 mb-4">
                  <p><span className="font-semibold text-slate-300">Balance:</span> <span className="text-white font-bold">{formatCoins(slot.balance)}</span></p>
                  <p className="text-xs text-slate-400">
                    Last Saved:<br/> {new Date(slot.lastSaved).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col space-y-2 font-pridi">
                  <button
                    onClick={() => onLoadSlot(index)}
                    className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transform hover:scale-105 transition-all duration-200"
                  >
                    Load Game
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transform hover:scale-105 transition-all duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col flex-grow items-center justify-center h-full">
                <p className="text-slate-400 font-fira mb-4">Empty Slot</p>
                <button
                  onClick={() => onLoadSlot(index)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-lg shadow-md transform hover:scale-105 transition-all duration-200 font-pridi"
                >
                  Start New Game
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SaveSlots;
