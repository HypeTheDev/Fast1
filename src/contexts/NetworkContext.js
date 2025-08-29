import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const NetworkContext = createContext();

const initialState = {
  socket: null,
  isConnected: false,
  nodeId: null,
  peers: new Map(),
  meshNetwork: {
    neighbors: [],
    routingTable: new Map(),
    messageQueue: [],
    heartbeatInterval: null,
  },
  connectionStats: {
    latency: 0,
    messagesSent: 0,
    messagesReceived: 0,
    connectedPeers: 0,
  },
  collaborativeSessions: new Map(),
};

function networkReducer(state, action) {
  switch (action.type) {
    case 'SET_SOCKET':
      return { ...state, socket: action.payload };
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };
    case 'SET_NODE_ID':
      return { ...state, nodeId: action.payload };
    case 'ADD_PEER':
      return {
        ...state,
        peers: new Map(state.peers).set(action.payload.id, action.payload),
        connectionStats: {
          ...state.connectionStats,
          connectedPeers: state.connectionStats.connectedPeers + 1
        }
      };
    case 'REMOVE_PEER':
      const newPeers = new Map(state.peers);
      newPeers.delete(action.payload);
      return {
        ...state,
        peers: newPeers,
        connectionStats: {
          ...state.connectionStats,
          connectedPeers: Math.max(0, state.connectionStats.connectedPeers - 1)
        }
      };
    case 'UPDATE_MESH_NETWORK':
      return {
        ...state,
        meshNetwork: { ...state.meshNetwork, ...action.payload }
      };
    case 'UPDATE_CONNECTION_STATS':
      return {
        ...state,
        connectionStats: { ...state.connectionStats, ...action.payload }
      };
    case 'START_COLLABORATIVE_SESSION':
      return {
        ...state,
        collaborativeSessions: new Map(state.collaborativeSessions)
          .set(action.payload.sessionId, action.payload)
      };
    case 'END_COLLABORATIVE_SESSION':
      const newSessions = new Map(state.collaborativeSessions);
      newSessions.delete(action.payload);
      return { ...state, collaborativeSessions: newSessions };
    default:
      return state;
  }
}

export function NetworkProvider({ children }) {
  const [state, dispatch] = useReducer(networkReducer, initialState);
  const heartbeatRef = useRef(null);

  // Initialize network connection
  useEffect(() => {
    const initNetwork = async () => {
      try {
        // Connect to signaling server
        const socket = io(process.env.REACT_APP_SIGNALING_SERVER || 'http://localhost:3001');
        
        socket.on('connect', () => {
          dispatch({ type: 'SET_CONNECTED', payload: true });
          dispatch({ type: 'SET_NODE_ID', payload: socket.id });
          
          // Start heartbeat
          heartbeatRef.current = setInterval(() => {
            socket.emit('heartbeat', { timestamp: Date.now() });
          }, 5000);
        });

        socket.on('disconnect', () => {
          dispatch({ type: 'SET_CONNECTED', payload: false });
          if (heartbeatRef.current) {
            clearInterval(heartbeatRef.current);
          }
        });

        socket.on('peer-connected', (peerData) => {
          dispatch({ type: 'ADD_PEER', payload: peerData });
        });

        socket.on('peer-disconnected', (peerId) => {
          dispatch({ type: 'REMOVE_PEER', payload: peerId });
        });

        socket.on('mesh-message', (message) => {
          handleMeshMessage(message);
        });

        dispatch({ type: 'SET_SOCKET', payload: socket });

      } catch (error) {
        console.error('Network initialization failed:', error);
      }
    };

    initNetwork();

    return () => {
      if (state.socket) {
        state.socket.disconnect();
      }
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
      }
    };
  }, [state.socket]);

  const handleMeshMessage = (message) => {
    // Handle mesh network messages
    switch (message.type) {
      case 'music-share':
        // Handle shared music data
        break;
      case 'parameter-change':
        // Handle parameter synchronization
        break;
      case 'game-state-sync':
        // Handle game state synchronization
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  };

  const actions = {
    sendMeshMessage: (message, targetPeerId = null) => {
      if (state.socket && state.isConnected) {
        const meshMessage = {
          ...message,
          from: state.nodeId,
          timestamp: Date.now(),
          target: targetPeerId,
        };
        state.socket.emit('mesh-message', meshMessage);
      }
    },
    broadcastToMesh: (message) => {
      actions.sendMeshMessage(message);
    },
    startCollaborativeSession: (sessionData) => {
      dispatch({ type: 'START_COLLABORATIVE_SESSION', payload: sessionData });
      actions.sendMeshMessage({
        type: 'session-start',
        sessionData
      });
    },
    endCollaborativeSession: (sessionId) => {
      dispatch({ type: 'END_COLLABORATIVE_SESSION', payload: sessionId });
      actions.sendMeshMessage({
        type: 'session-end',
        sessionId
      });
    },
    updateMeshNetwork: (data) => {
      dispatch({ type: 'UPDATE_MESH_NETWORK', payload: data });
    },
  };

  return (
    <NetworkContext.Provider value={{ state, actions }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
}