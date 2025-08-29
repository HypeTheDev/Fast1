import React, { createContext, useContext, useReducer, useEffect } from 'react';

const GameContext = createContext();

const initialState = {
  player: {
    id: null,
    name: 'Player',
    position: { x: 0, y: 0, z: 0 },
    inventory: [],
    skills: {
      music: 1,
      networking: 1,
      creativity: 1,
    },
    stats: {
      energy: 100,
      inspiration: 100,
      reputation: 0,
    },
  },
  world: {
    time: 0,
    weather: 'sunny',
    activeEvents: [],
    unlockedAreas: ['spawn-island'],
  },
  quests: [],
  achievements: [],
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_PLAYER':
      return { ...state, player: { ...state.player, ...action.payload } };
    case 'UPDATE_POSITION':
      return {
        ...state,
        player: { ...state.player, position: action.payload }
      };
    case 'UPDATE_STATS':
      return {
        ...state,
        player: {
          ...state.player,
          stats: { ...state.player.stats, ...action.payload }
        }
      };
    case 'ADD_ITEM':
      return {
        ...state,
        player: {
          ...state.player,
          inventory: [...state.player.inventory, action.payload]
        }
      };
    case 'UPDATE_WORLD':
      return { ...state, world: { ...state.world, ...action.payload } };
    case 'ADD_QUEST':
      return { ...state, quests: [...state.quests, action.payload] };
    case 'COMPLETE_QUEST':
      return {
        ...state,
        quests: state.quests.map(quest =>
          quest.id === action.payload
            ? { ...quest, completed: true }
            : quest
        )
      };
    case 'ADD_ACHIEVEMENT':
      return { ...state, achievements: [...state.achievements, action.payload] };
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Initialize player ID on mount
  useEffect(() => {
    const playerId = localStorage.getItem('harmony-island-player-id') ||
                     `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('harmony-island-player-id', playerId);
    dispatch({ type: 'SET_PLAYER', payload: { id: playerId } });
  }, []);

  const actions = {
    setPlayer: (data) => dispatch({ type: 'SET_PLAYER', payload: data }),
    updatePosition: (position) => dispatch({ type: 'UPDATE_POSITION', payload: position }),
    updateStats: (stats) => dispatch({ type: 'UPDATE_STATS', payload: stats }),
    addItem: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
    updateWorld: (data) => dispatch({ type: 'UPDATE_WORLD', payload: data }),
    addQuest: (quest) => dispatch({ type: 'ADD_QUEST', payload: quest }),
    completeQuest: (questId) => dispatch({ type: 'COMPLETE_QUEST', payload: questId }),
    addAchievement: (achievement) => dispatch({ type: 'ADD_ACHIEVEMENT', payload: achievement }),
  };

  return (
    <GameContext.Provider value={{ state, actions }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}