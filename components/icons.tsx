import React from 'react';

const GEM_ICON_URL = 'https://bing.com/th/id/BCO.378876b9-44ae-456e-bf36-f6497519a4a3.png';
const MINE_ICON_URL = 'https://bing.com/th/id/BCO.aafdaab6-ac8d-4a72-a0f7-0294701f245d.png';

export const GemIcon: React.FC<{ className?: string }> = ({ className }) => (
  <img src={GEM_ICON_URL} alt="Gem" className={className} />
);

export const MineIcon: React.FC<{ className?: string }> = ({ className }) => (
  <img src={MINE_ICON_URL} alt="Mine" className={className} />
);
