import React from 'react';
import { useGame } from '../contexts/GameContext';

const MiniMap = () => {
  const { state: gameState } = useGame();

  return (
    <div className="mini-map">
      <h4>Mini Map</h4>
      <div className="map-container">
        <div className="map-island">
          {/* Player position indicator */}
          <div 
            className="player-indicator"
            style={{
              left: `${50 + gameState.player.position.x * 2}%`,
              top: `${50 + gameState.player.position.z * 2}%`
            }}
          >
            🧑
          </div>
          
          {/* Interactive elements on map */}
          <div className="map-element music-studio" style={{ left: '60%', top: '40%' }}>
            🎵
          </div>
          <div className="map-element performance-stage" style={{ left: '40%', top: '40%' }}>
            🎤
          </div>
          <div className="map-element network-hub" style={{ left: '50%', top: '70%' }}>
            🌐
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniMap;