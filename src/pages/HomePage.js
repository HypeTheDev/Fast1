import React from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { useNetwork } from '../contexts/NetworkContext';

const HomePage = () => {
  const { state: gameState, actions: gameActions } = useGame();
  const { state: networkState } = useNetwork();

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Harmony Island</h1>
        <p>An interactive music game where creativity meets collaboration</p>
        
        <div className="network-status">
          <div className={`connection-indicator ${networkState.isConnected ? 'connected' : 'disconnected'}`}>
            {networkState.isConnected ? '🟢' : '🔴'} 
            {networkState.isConnected ? 'Connected to Mesh Network' : 'Offline Mode'}
          </div>
          {networkState.isConnected && (
            <div className="peer-info">
              {networkState.peers.size} players online
            </div>
          )}
        </div>
      </div>

      <div className="menu-options">
        <Link to="/game" className="menu-button primary">
          <h3>Enter Island</h3>
          <p>Explore the musical world and connect with other players</p>
        </Link>

        <Link to="/studio" className="menu-button secondary">
          <h3>Music Studio</h3>
          <p>Create and edit music with real-time collaboration</p>
        </Link>

        <div className="menu-button tertiary">
          <h3>Settings</h3>
          <p>Customize your experience and preferences</p>
        </div>
      </div>

      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature">
            <h4>🎵 Music Creation</h4>
            <p>Import, edit, and create music with professional tools</p>
          </div>
          <div className="feature">
            <h4>🌐 Mesh Networking</h4>
            <p>Connect directly with other players for real-time collaboration</p>
          </div>
          <div className="feature">
            <h4>🏝️ Interactive Island</h4>
            <p>Explore a dynamic world that responds to your music</p>
          </div>
          <div className="feature">
            <h4>🎮 RPG Elements</h4>
            <p>Level up your musical skills and unlock new abilities</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;