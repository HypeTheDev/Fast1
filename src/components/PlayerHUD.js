import React from 'react';
import { useGame } from '../contexts/GameContext';
import { useAudio } from '../contexts/AudioContext';
import { useNetwork } from '../contexts/NetworkContext';

const PlayerHUD = () => {
  const { state: gameState } = useGame();
  const { state: audioState } = useAudio();
  const { state: networkState } = useNetwork();

  return (
    <div className="player-hud">
      {/* Player Stats */}
      <div className="hud-section player-stats">
        <h4>Player Stats</h4>
        <div className="stat-bar">
          <span>Energy:</span>
          <div className="progress-bar">
            <div 
              className="progress-fill energy" 
              style={{ width: `${gameState.player.stats.energy}%` }}
            />
          </div>
          <span>{gameState.player.stats.energy}/100</span>
        </div>
        <div className="stat-bar">
          <span>Inspiration:</span>
          <div className="progress-bar">
            <div 
              className="progress-fill inspiration" 
              style={{ width: `${gameState.player.stats.inspiration}%` }}
            />
          </div>
          <span>{gameState.player.stats.inspiration}/100</span>
        </div>
      </div>

      {/* Audio Controls */}
      <div className="hud-section audio-controls">
        <h4>Audio</h4>
        <div className="control-group">
          <label>Master Volume</label>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1"
            value={audioState.masterVolume}
            onChange={(e) => audioActions.setMasterVolume(parseFloat(e.target.value))}
          />
        </div>
        <div className="track-info">
          {audioState.currentTrack && (
            <div>Now Playing: {audioState.currentTrack.name}</div>
          )}
          <div>Tracks: {audioState.tracks.size}</div>
        </div>
      </div>

      {/* Network Status */}
      <div className="hud-section network-status">
        <h4>Network</h4>
        <div className={`status-indicator ${networkState.isConnected ? 'connected' : 'disconnected'}`}>
          {networkState.isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
        <div className="network-info">
          <div>Peers: {networkState.peers.size}</div>
          <div>Latency: {networkState.connectionStats.latency}ms</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="hud-section quick-actions">
        <button className="action-btn">🎵 Studio</button>
        <button className="action-btn">🎤 Perform</button>
        <button className="action-btn">🤝 Collaborate</button>
      </div>
    </div>
  );
};

export default PlayerHUD;