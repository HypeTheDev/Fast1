import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import * as Tone from 'tone';

const AudioContext = createContext();

const initialState = {
  toneContext: null,
  isInitialized: false,
  masterVolume: 0.8,
  tracks: new Map(),
  effects: {
    reverb: null,
    delay: null,
    distortion: null,
    filter: null,
  },
  analyser: null,
  currentSession: null,
  audioBuffers: new Map(),
  sharedAudioData: new Map(),
};

function audioReducer(state, action) {
  switch (action.type) {
    case 'SET_TONE_CONTEXT':
      return { ...state, toneContext: action.payload, isInitialized: true };
    case 'SET_MASTER_VOLUME':
      return { ...state, masterVolume: action.payload };
    case 'ADD_TRACK':
      return {
        ...state,
        tracks: new Map(state.tracks).set(action.payload.id, action.payload)
      };
    case 'REMOVE_TRACK':
      const newTracks = new Map(state.tracks);
      newTracks.delete(action.payload);
      return { ...state, tracks: newTracks };
    case 'UPDATE_TRACK':
      const tracks = new Map(state.tracks);
      const existingTrack = tracks.get(action.payload.id);
      if (existingTrack) {
        tracks.set(action.payload.id, { ...existingTrack, ...action.payload });
      }
      return { ...state, tracks };
    case 'SET_EFFECT':
      return {
        ...state,
        effects: { ...state.effects, [action.payload.effect]: action.payload.instance }
      };
    case 'SET_ANALYSER':
      return { ...state, analyser: action.payload };
    case 'SET_CURRENT_SESSION':
      return { ...state, currentSession: action.payload };
    case 'ADD_AUDIO_BUFFER':
      return {
        ...state,
        audioBuffers: new Map(state.audioBuffers).set(action.payload.id, action.payload.buffer)
      };
    case 'ADD_SHARED_AUDIO':
      return {
        ...state,
        sharedAudioData: new Map(state.sharedAudioData).set(action.payload.id, action.payload.data)
      };
    default:
      return state;
  }
}

export function AudioProvider({ children }) {
  const [state, dispatch] = useReducer(audioReducer, initialState);
  const audioContextRef = useRef(null);

  // Initialize Tone.js
  useEffect(() => {
    const initAudio = async () => {
      try {
        // Initialize Tone.js context
        await Tone.start();
        const context = Tone.getContext();
        
        // Create master volume control
        const masterVolume = new Tone.Volume().toDestination();
        
        // Create effects chain
        const reverb = new Tone.Reverb({
          decay: 2,
          wet: 0.3
        });
        
        const delay = new Tone.Delay({
          delayTime: 0.25,
          wet: 0.2
        });
        
        const distortion = new Tone.Distortion({
          distortion: 0.4,
          wet: 0.1
        });
        
        const filter = new Tone.Filter({
          frequency: 1000,
          Q: 1
        });

        // Create analyser for visualizations
        const analyser = new Tone.Analyser({
          type: 'fft',
          size: 1024
        });

        // Connect effects chain
        masterVolume.connect(reverb);
        reverb.connect(delay);
        delay.connect(distortion);
        distortion.connect(filter);
        filter.connect(analyser);
        analyser.connect(Tone.getDestination());

        // Store references
        audioContextRef.current = {
          masterVolume,
          reverb,
          delay,
          distortion,
          filter,
          analyser
        };

        dispatch({ type: 'SET_TONE_CONTEXT', payload: context });
        dispatch({ type: 'SET_EFFECT', payload: { effect: 'reverb', instance: reverb } });
        dispatch({ type: 'SET_EFFECT', payload: { effect: 'delay', instance: delay } });
        dispatch({ type: 'SET_EFFECT', payload: { effect: 'distortion', instance: distortion } });
        dispatch({ type: 'SET_EFFECT', payload: { effect: 'filter', instance: filter } });
        dispatch({ type: 'SET_ANALYSER', payload: analyser });

        // Load effects
        await Promise.all([
          reverb.generate(),
        ]);

      } catch (error) {
        console.error('Audio initialization failed:', error);
      }
    };

    initAudio();

    return () => {
      // Cleanup
      if (audioContextRef.current) {
        Object.values(audioContextRef.current).forEach(node => {
          if (node && typeof node.dispose === 'function') {
            node.dispose();
          }
        });
      }
    };
  }, []);

  const actions = {
    setMasterVolume: (volume) => {
      dispatch({ type: 'SET_MASTER_VOLUME', payload: volume });
      if (audioContextRef.current?.masterVolume) {
        audioContextRef.current.masterVolume.volume.value = Tone.gainToDb(volume);
      }
    },
    createTrack: async (audioData) => {
      try {
        const buffer = await Tone.getContext().createBufferSource(audioData);
        const track = {
          id: `track-${Date.now()}`,
          buffer,
          volume: 1,
          effects: [],
          isPlaying: false,
        };
        dispatch({ type: 'ADD_TRACK', payload: track });
        return track.id;
      } catch (error) {
        console.error('Failed to create track:', error);
        return null;
      }
    },
    playTrack: (trackId) => {
      const track = state.tracks.get(trackId);
      if (track && !track.isPlaying) {
        track.buffer.start();
        dispatch({ type: 'UPDATE_TRACK', payload: { id: trackId, isPlaying: true } });
      }
    },
    stopTrack: (trackId) => {
      const track = state.tracks.get(trackId);
      if (track && track.isPlaying) {
        track.buffer.stop();
        dispatch({ type: 'UPDATE_TRACK', payload: { id: trackId, isPlaying: false } });
      }
    },
    updateTrackParameter: (trackId, parameter, value) => {
      dispatch({ type: 'UPDATE_TRACK', payload: { id: trackId, [parameter]: value } });
    },
    shareAudioData: (audioData) => {
      const sharedId = `shared-${Date.now()}`;
      dispatch({ type: 'ADD_SHARED_AUDIO', payload: { id: sharedId, data: audioData } });
      return sharedId;
    },
    startCollaborativeSession: (sessionData) => {
      dispatch({ type: 'SET_CURRENT_SESSION', payload: sessionData });
    },
    endCollaborativeSession: () => {
      dispatch({ type: 'SET_CURRENT_SESSION', payload: null });
    },
  };

  return (
    <AudioContext.Provider value={{ state, actions }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}