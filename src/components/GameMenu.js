import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GameMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="game-menu">
      <button onClick={() => setIsOpen(!isOpen)} className="menu-toggle">
        ☰
      </button>
      
      {isOpen && (
        <div className="menu-dropdown">
          <button onClick={() => navigate('/')}>Home</button>
          <button onClick={() => navigate('/game')}>Game</button>
          <button onClick={() => navigate('/studio')}>Studio</button>
          <button onClick={() => navigate('/settings')}>Settings</button>
        </div>
      )}
    </div>
  );
};

export default GameMenu;