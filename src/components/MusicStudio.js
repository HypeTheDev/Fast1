import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAudio } from '../contexts/AudioContext';
import { useNetwork } from '../contexts/NetworkContext';
import TrackEditor from './TrackEditor';
import EffectPanel from './EffectPanel';
import ParameterControls from './ParameterControls';
import CollaborationPanel from './CollaborationPanel';

const MusicStudio = () => {
  const { state: audioState, actions: audioActions } = useAudio();
  const { state: networkState, actions: networkActions } = useNetwork();
  
  const [currentProject, setCurrentProject] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [studioMode, setStudioMode] = useState('edit'); // 'edit', 'mix', 'collaborate'

  // Handle file drops for music import
  const onDrop = useCallback(async (acceptedFiles) => {
    for (const file of acceptedFiles) {
      try {
        const trackId = await audioActions.createTrack(file);
        if (trackId) {
          // Add to current project
          setCurrentProject(prev => ({
            ...prev,
            tracks: [...(prev?.tracks || []), trackId]
          }));
          
          // Share with network if in collaborative mode
          if (studioMode === 'collaborate') {
            const sharedId = audioActions.shareAudioData({
              trackId,
              fileName: file.name,
              parameters: getDefaultParameters()
            });
            
            networkActions.sendMeshMessage({
              type: 'music-share',
              sharedId,
              trackData: { trackId, fileName: file.name }
            });
          }
        }
      } catch (error) {
        console.error('Failed to import track:', error);
      }
    }
  }, [audioActions, networkActions, studioMode]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.ogg', '.m4a']
    }
  });

  // Handle parameter changes
  const handleParameterChange = (parameter, value) => {
    if (selectedTrack) {
      audioActions.updateTrackParameter(selectedTrack, parameter, value);
      
      // Broadcast parameter change to network
      if (studioMode === 'collaborate') {
        networkActions.sendMeshMessage({
          type: 'parameter-change',
          trackId: selectedTrack,
          parameter,
          value,
          timestamp: Date.now()
        });
      }
    }
  };

  // Handle network messages for collaborative editing
  useEffect(() => {
    const handleNetworkMessage = (message) => {
      switch (message.type) {
        case 'parameter-change':
          if (message.trackId && audioState.tracks.has(message.trackId)) {
            audioActions.updateTrackParameter(
              message.trackId, 
              message.parameter, 
              message.value
            );
          }
          break;
        case 'music-share':
          // Handle incoming shared music
          console.log('Received shared music:', message.trackData);
          break;
        default:
          break;
      }
    };

    // This would be connected to the network context's message handling
    // For now, we'll simulate
  }, [audioState.tracks, audioActions]);

  return (
    <div className="music-studio">
      <div className="studio-header">
        <h2>Music Studio</h2>
        <div className="studio-modes">
          <button 
            className={studioMode === 'edit' ? 'active' : ''}
            onClick={() => setStudioMode('edit')}
          >
            Edit
          </button>
          <button 
            className={studioMode === 'mix' ? 'active' : ''}
            onClick={() => setStudioMode('mix')}
          >
            Mix
          </button>
          <button 
            className={studioMode === 'collaborate' ? 'active' : ''}
            onClick={() => setStudioMode('collaborate')}
          >
            Collaborate ({networkState.peers.size} peers)
          </button>
        </div>
      </div>

      <div className="studio-content">
        {/* File Drop Zone */}
        <div {...getRootProps()} className={`drop-zone ${isDragActive ? 'active' : ''}`}>
          <input {...getInputProps()} />
          <p>
            {isDragActive
              ? "Drop your music files here..."
              : "Drag & drop music files, or click to select"}
          </p>
        </div>

        {/* Track List */}
        <div className="track-list">
          {Array.from(audioState.tracks.values()).map(track => (
            <div 
              key={track.id}
              className={`track-item ${selectedTrack === track.id ? 'selected' : ''}`}
              onClick={() => setSelectedTrack(track.id)}
            >
              <span>{track.name || `Track ${track.id}`}</span>
              <button onClick={() => audioActions.playTrack(track.id)}>
                {track.isPlaying ? '⏸️' : '▶️'}
              </button>
            </div>
          ))}
        </div>

        {/* Studio Panels */}
        {selectedTrack && (
          <>
            <TrackEditor 
              trackId={selectedTrack}
              onParameterChange={handleParameterChange}
            />
            <EffectPanel 
              trackId={selectedTrack}
              effects={audioState.effects}
            />
            <ParameterControls 
              trackId={selectedTrack}
              onChange={handleParameterChange}
            />
          </>
        )}

        {/* Collaboration Panel */}
        {studioMode === 'collaborate' && (
          <CollaborationPanel 
            peers={networkState.peers}
            currentSession={audioState.currentSession}
          />
        )}
      </div>

      {/* Recording Controls */}
      <div className="recording-controls">
        <button 
          className={`record-btn ${isRecording ? 'recording' : ''}`}
          onClick={() => setIsRecording(!isRecording)}
        >
          {isRecording ? '⏹️ Stop Recording' : '⏺️ Start Recording'}
        </button>
        <button onClick={exportProject}>
          Export Project
        </button>
      </div>
    </div>
  );

  function getDefaultParameters() {
    return {
      volume: 0.8,
      pan: 0,
      effects: {
        reverb: { enabled: false },
        delay: { enabled: false },
        distortion: { enabled: false },
        filter: { enabled: false }
      }
    };
  }

  function exportProject() {
    // Export current project as a shareable format
    const projectData = {
      id: currentProject?.id || `project-${Date.now()}`,
      tracks: currentProject?.tracks || [],
      parameters: audioState.tracks,
      timestamp: Date.now()
    };
    
    console.log('Exporting project:', projectData);
    // TODO: Implement actual export functionality
  }
};

export default MusicStudio;