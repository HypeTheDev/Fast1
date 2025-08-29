import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isPlaying: false,
  currentTrack: null,
  volume: 0.8,
  masterVolume: 0.8,
  tracks: [],
  effects: {
    reverb: { enabled: false, wet: 0.3, decay: 2 },
    delay: { enabled: false, wet: 0.2, delayTime: 0.25 },
    distortion: { enabled: false, wet: 0.1, distortion: 0.4 },
    filter: { enabled: false, frequency: 1000, Q: 1 },
  },
  audioContext: null,
  analyserNode: null,
  gainNode: null,
  sharedTracks: [],
  collaborativeSession: {
    isActive: false,
    participants: [],
    sessionId: null,
  },
};

const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    play: (state) => {
      state.isPlaying = true;
    },
    pause: (state) => {
      state.isPlaying = false;
    },
    stop: (state) => {
      state.isPlaying = false;
      state.currentTrack = null;
    },
    setCurrentTrack: (state, action) => {
      state.currentTrack = action.payload;
    },
    setVolume: (state, action) => {
      state.volume = Math.max(0, Math.min(1, action.payload));
    },
    setMasterVolume: (state, action) => {
      state.masterVolume = Math.max(0, Math.min(1, action.payload));
    },
    addTrack: (state, action) => {
      state.tracks.push(action.payload);
    },
    removeTrack: (state, action) => {
      state.tracks = state.tracks.filter(track => track.id !== action.payload);
    },
    updateTrack: (state, action) => {
      const index = state.tracks.findIndex(track => track.id === action.payload.id);
      if (index !== -1) {
        state.tracks[index] = { ...state.tracks[index], ...action.payload };
      }
    },
    updateEffect: (state, action) => {
      const { effect, settings } = action.payload;
      state.effects[effect] = { ...state.effects[effect], ...settings };
    },
    toggleEffect: (state, action) => {
      state.effects[action.payload].enabled = !state.effects[action.payload].enabled;
    },
    addSharedTrack: (state, action) => {
      state.sharedTracks.push(action.payload);
    },
    startCollaborativeSession: (state, action) => {
      state.collaborativeSession = {
        isActive: true,
        participants: action.payload.participants || [],
        sessionId: action.payload.sessionId,
      };
    },
    endCollaborativeSession: (state) => {
      state.collaborativeSession = {
        isActive: false,
        participants: [],
        sessionId: null,
      };
    },
  },
});

export const {
  play,
  pause,
  stop,
  setCurrentTrack,
  setVolume,
  setMasterVolume,
  addTrack,
  removeTrack,
  updateTrack,
  updateEffect,
  toggleEffect,
  addSharedTrack,
  startCollaborativeSession,
  endCollaborativeSession,
} = audioSlice.actions;

export default audioSlice.reducer;