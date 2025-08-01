import React from 'react';
import { TileData, TileValue } from '../types';
import { GemIcon, MineIcon } from './icons';

interface TileProps {
  data: TileData | null;
  onClick: () => void;
  isInteractive: boolean;
}

const Tile: React.FC<TileProps> = ({ data, onClick, isInteractive }) => {
  const isRevealed = data?.revealed ?? false;
  
  const baseClasses = 'aspect-square w-full rounded-md flex items-center justify-center transition-all duration-300';
  const interactiveClasses = isInteractive ? 'cursor-pointer hover:bg-slate-600' : 'cursor-default';
  const revealedClasses = 'bg-slate-700/50 [transform:rotateY(180deg)]';
  const hiddenClasses = 'bg-slate-800 [transform:rotateY(0deg)]';

  const tileContent = () => {
    if (!data) return null;
    if (data.value === TileValue.GEM) {
      return <GemIcon className="w-full h-full object-contain" />;
    }
    if (data.value === TileValue.MINE) {
      return <MineIcon className="w-full h-full object-contain" />;
    }
    return null;
  };
  
  return (
    <div className="[perspective:1000px]" onClick={isInteractive && !isRevealed ? onClick : undefined}>
      <div
        className={`${baseClasses} ${isRevealed ? revealedClasses : `${hiddenClasses} ${isInteractive ? interactiveClasses : ''}`}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {isRevealed && (
          <div className="absolute inset-0 flex items-center justify-center [transform:rotateY(180deg)] p-2">
            {tileContent()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tile;