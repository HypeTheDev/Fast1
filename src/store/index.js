import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './slices/gameSlice';
import networkReducer from './slices/networkSlice';
import audioReducer from './slices/audioSlice';
import playerReducer from './slices/playerSlice';
import islandReducer from './slices/islandSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    network: networkReducer,
    audio: audioReducer,
    player: playerReducer,
    island: islandReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;