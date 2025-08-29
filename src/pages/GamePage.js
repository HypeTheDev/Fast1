import React from 'react';
import Island from '../components/Island';
import PlayerHUD from '../components/PlayerHUD';
import MiniMap from '../components/MiniMap';

const GamePage = () => {
  return (
    <div className="game-page">
      <Island />
      <PlayerHUD />
      <MiniMap />
    </div>
  );
};

export default GamePage;