import React, { useEffect, useRef } from 'react';
import { useGame } from '../contexts/GameContext';
import { useNetwork } from '../contexts/NetworkContext';
import { useAudio } from '../contexts/AudioContext';
import IslandRenderer from './IslandRenderer';
import InteractiveElements from './InteractiveElements';
import EnvironmentalEffects from './EnvironmentalEffects';

const Island = () => {
  const { state: gameState, actions: gameActions } = useGame();
  const { state: networkState, actions: networkActions } = useNetwork();
  const { state: audioState, actions: audioActions } = useAudio();
  
  const islandRef = useRef(null);

  // Initialize island environment
  useEffect(() => {
    const initIsland = async () => {
      // Set up island-specific audio environment
      await audioActions.setMasterVolume(0.7);
      
      // Initialize environmental sounds
      const ambientSound = await audioActions.createTrack('/audio/ambient/ocean-waves.mp3');
      if (ambientSound) {
        audioActions.playTrack(ambientSound);
      }
    };

    initIsland();
  }, []);

  // Handle network events affecting the island
  useEffect(() => {
    if (networkState.isConnected && networkState.peers.size > 0) {
      // Update island visuals based on network activity
      gameActions.updateWorld({
        activeEvents: Array.from(networkState.peers.values()).map(peer => ({
          type: 'peer-activity',
          peerId: peer.id,
          position: peer.position || { x: 0, y: 0, z: 0 }
        }))
      });
    }
  }, [networkState.peers, networkState.isConnected]);

  // Handle music parameter changes
  useEffect(() => {
    if (audioState.sharedAudioData.size > 0) {
      // Update island environment based on shared music
      const sharedTracks = Array.from(audioState.sharedAudioData.values());
      
      gameActions.updateWorld({
        environmentalEffects: sharedTracks.map(track => ({
          type: 'music-influence',
          trackId: track.id,
          intensity: track.parameters?.intensity || 0.5
        }))
      });
    }
  }, [audioState.sharedAudioData]);

  return (
    <div className="island-container" ref={islandRef}>
      <IslandRenderer 
        playerPosition={gameState.player.position}
        worldState={gameState.world}
        networkPeers={networkState.peers}
      />
      
      <InteractiveElements 
        player={gameState.player}
        onInteraction={handleInteraction}
      />
      
      <EnvironmentalEffects 
        effects={gameState.world.environmentalEffects}
        weather={gameState.world.weather}
      />
      
      {/* Island-specific UI */}
      <div className="island-ui">
        <div className="location-indicator">
          {gameState.world.currentArea || 'Main Island'}
        </div>
        
        <div className="network-indicators">
          <div className="peer-count">
            Connected Players: {networkState.peers.size}
          </div>
          <div className="connection-strength">
            Signal: {networkState.connectionStats.latency < 100 ? 'Strong' : 'Weak'}
          </div>
        </div>
      </div>
    </div>
  );

  function handleInteraction(interaction) {
    switch (interaction.type) {
      case 'music-studio':
        // Open music studio interface
        gameActions.setGameMode('creation');
        break;
      case 'performance-stage':
        // Start performance mode
        gameActions.setGameMode('performance');
        break;
      case 'network-hub':
        // Open network management
        gameActions.setGameMode('collaboration');
        break;
      default:
        console.log('Unknown interaction:', interaction);
    }
  }
};

export default Island;