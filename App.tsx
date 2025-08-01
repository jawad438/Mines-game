import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GameState, TileData, TileValue, GameSaveState } from './types';
import { calculateMultiplier, createGameGrid } from './utils/calculator';
import GameControls from './components/GameControls';
import GameBoard from './components/GameBoard';
import GameInfo from './components/GameInfo';
import { GemIcon, MineIcon } from './components/icons';
import { useSaveSlots } from './hooks/useSaveSlots';
import SaveSlots from './components/SaveSlots';
import SaveNotification from './components/SaveNotification';


const TOTAL_TILES = 25;
const AUTOSAVE_INTERVAL = 60 * 1000; // 1 minute

const getInitialGameState = (): GameSaveState => ({
  balance: 1000,
  betAmount: 10,
  mineCount: 3,
  gameState: GameState.BETTING,
  grid: [],
  revealedSafeTiles: 0,
  isLost: false,
});

export default function App() {
  const { slots, saveSlot, deleteSlot } = useSaveSlots();
  const [currentSlotIndex, setCurrentSlotIndex] = useState<number | null>(null);

  // Game State
  const [balance, setBalance] = useState<number>(1000);
  const [betAmount, setBetAmount] = useState<number>(10);
  const [mineCount, setMineCount] = useState<number>(3);
  const [gameState, setGameState] = useState<GameState>(GameState.BETTING);
  const [grid, setGrid] = useState<TileData[]>([]);
  const [revealedSafeTiles, setRevealedSafeTiles] = useState<number>(0);
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1);
  const [isLost, setIsLost] = useState<boolean>(false);
  const [saveNotification, setSaveNotification] = useState<{ show: boolean, message: string }>({ show: false, message: '' });

  const triggerSaveNotification = (message: string) => {
    setSaveNotification({ show: true, message });
    setTimeout(() => {
      setSaveNotification({ show: false, message: '' });
    }, 2000);
  };

  const currentGameSaveState: GameSaveState = useMemo(() => ({
    balance,
    betAmount,
    mineCount,
    gameState,
    grid,
    revealedSafeTiles,
    isLost,
  }), [balance, betAmount, mineCount, gameState, grid, revealedSafeTiles, isLost]);

  // Auto-save logic
  useEffect(() => {
    if (currentSlotIndex === null || gameState === GameState.ENDED) return;

    const intervalId = setInterval(() => {
      saveSlot(currentSlotIndex, currentGameSaveState);
      triggerSaveNotification('Game auto-saved!');
    }, AUTOSAVE_INTERVAL);

    return () => clearInterval(intervalId);
  }, [currentSlotIndex, saveSlot, currentGameSaveState, gameState]);

  const handleLoadSlot = (index: number) => {
    const slotData = slots[index];
    const initialState = slotData || getInitialGameState();

    setBalance(initialState.balance);
    setBetAmount(initialState.betAmount);
    setMineCount(initialState.mineCount);
    setGameState(initialState.gameState);
    setGrid(initialState.grid);
    setRevealedSafeTiles(initialState.revealedSafeTiles);
    setIsLost(initialState.isLost);
    setCurrentMultiplier(calculateMultiplier(TOTAL_TILES, initialState.mineCount, initialState.revealedSafeTiles));

    setCurrentSlotIndex(index);
  };

  const handleDeleteSlot = (index: number) => {
    deleteSlot(index);
  };

  const handleBackToSlots = () => {
    if (currentSlotIndex !== null) {
      saveSlot(currentSlotIndex, currentGameSaveState);
      triggerSaveNotification('Game saved!');
    }
    setCurrentSlotIndex(null);
  };

  const handleStartGame = () => {
    if (betAmount > balance) {
      alert("Bet amount cannot be greater than your balance.");
      return;
    }
    if (betAmount <= 0) {
      alert("Bet amount must be positive.");
      return;
    }

    setBalance(prev => prev - betAmount);
    setGameState(GameState.PLAYING);
    setGrid(createGameGrid(TOTAL_TILES, mineCount));
    setRevealedSafeTiles(0);
    setCurrentMultiplier(1);
    setIsLost(false);
  };

  const handleTileClick = (index: number) => {
    if (gameState !== GameState.PLAYING || grid[index].revealed) {
      return;
    }

    const newGrid = [...grid];
    newGrid[index] = { ...newGrid[index], revealed: true };
    setGrid(newGrid);

    if (newGrid[index].value === TileValue.MINE) {
      setIsLost(true);
      setGameState(GameState.ENDED);
      revealAllMines();
    } else {
      const newRevealedSafeTiles = revealedSafeTiles + 1;
      setRevealedSafeTiles(newRevealedSafeTiles);
      const newMultiplier = calculateMultiplier(TOTAL_TILES, mineCount, newRevealedSafeTiles);
      setCurrentMultiplier(newMultiplier);

      const safeTiles = TOTAL_TILES - mineCount;
      if (newRevealedSafeTiles === safeTiles) {
        // Auto cash out on winning
        handleCashOut(newMultiplier);
      }
    }
  };

  const revealAllMines = useCallback(() => {
    setGrid(prevGrid => prevGrid.map(tile => tile.value === TileValue.MINE ? { ...tile, revealed: true } : tile));
  }, []);

  const handleCashOut = (multiplier = currentMultiplier) => {
    if (gameState !== GameState.PLAYING) return;

    const payout = betAmount * multiplier;
    setBalance(prev => prev + payout);
    setGameState(GameState.ENDED);
    revealAllMines();
  };

  const handlePlayAgain = () => {
    setGameState(GameState.BETTING);
    setGrid([]);
    setIsLost(false);
  }

  const currentPayout = betAmount * currentMultiplier;
  const nextMultiplier = calculateMultiplier(TOTAL_TILES, mineCount, revealedSafeTiles + 1);
  const nextPayout = betAmount * nextMultiplier;

  if (currentSlotIndex === null) {
    return (
      <SaveSlots
        slots={slots}
        onLoadSlot={handleLoadSlot}
        onDeleteSlot={handleDeleteSlot}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto">
          <header className="mb-6 text-center">
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 font-raleway">
              Virtual Mines
            </h1>
            <p className="text-slate-400 mt-2 font-fira">Slot {currentSlotIndex + 1} | Uncover gems, avoid the mines.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-slate-800 p-6 rounded-xl shadow-lg h-fit">
              <GameControls
                betAmount={betAmount}
                setBetAmount={setBetAmount}
                mineCount={mineCount}
                setMineCount={setMineCount}
                balance={balance}
                gameState={gameState}
                onStartGame={handleStartGame}
                onPlayAgain={handlePlayAgain}
                onCashOut={() => handleCashOut()}
                isCashOutPossible={gameState === GameState.PLAYING && revealedSafeTiles > 0}
                onBackToSlots={handleBackToSlots}
              />
            </div>

            <main className="lg:col-span-2 relative">
              <GameBoard grid={grid} onTileClick={handleTileClick} gameState={gameState} />
              {gameState === GameState.ENDED && (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center rounded-xl z-20 font-pridi">
                  <div className="text-center">
                    {isLost ? (
                      <>
                        <MineIcon className="w-20 h-20 mx-auto" />
                        <h2 className="text-4xl font-bold mt-4 text-red-500">Boom!</h2>
                        <p className="text-xl mt-2 text-slate-300">You hit a mine and lost {betAmount.toFixed(2)} coins.</p>
                      </>
                    ) : (
                      <>
                        <GemIcon className="w-20 h-20 mx-auto" />
                        <h2 className="text-4xl font-bold mt-4 text-emerald-400">Cashed Out!</h2>
                        <p className="text-xl mt-2 text-slate-300">You won {(betAmount * currentMultiplier).toFixed(2)} coins!</p>
                      </>
                    )}
                    <button
                      onClick={handlePlayAgain}
                      className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-transform"
                    >
                      Play Again
                    </button>
                  </div>
                </div>
              )}
            </main>
          </div>

          <div className="mt-6 bg-slate-800 p-4 rounded-xl shadow-lg">
            <GameInfo
              balance={balance}
              multiplier={currentMultiplier}
              payout={currentPayout}
              nextPayout={nextPayout}
              gameState={gameState}
            />
          </div>
        </div>
      </div>
      <SaveNotification show={saveNotification.show} message={saveNotification.message} />
    </>
  );
}