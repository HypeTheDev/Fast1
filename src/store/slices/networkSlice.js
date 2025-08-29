import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isConnected: false,
  connectionType: 'mesh', // 'mesh', 'direct', 'relay'
  peers: [],
  activeConnections: 0,
  networkStats: {
    latency: 0,
    bandwidth: 0,
    packetLoss: 0,
    connectedPeers: 0,
  },
  meshNetwork: {
    nodeId: null,
    neighbors: [],
    routingTable: {},
    messageQueue: [],
  },
  sync: {
    isSynchronized: false,
    lastSync: null,
    pendingChanges: [],
  },
};

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    connect: (state) => {
      state.isConnected = true;
    },
    disconnect: (state) => {
      state.isConnected = false;
      state.peers = [];
      state.activeConnections = 0;
    },
    addPeer: (state, action) => {
      if (!state.peers.find(peer => peer.id === action.payload.id)) {
        state.peers.push(action.payload);
        state.activeConnections++;
      }
    },
    removePeer: (state, action) => {
      state.peers = state.peers.filter(peer => peer.id !== action.payload);
      state.activeConnections = Math.max(0, state.activeConnections - 1);
    },
    updateNetworkStats: (state, action) => {
      state.networkStats = { ...state.networkStats, ...action.payload };
    },
    setNodeId: (state, action) => {
      state.meshNetwork.nodeId = action.payload;
    },
    updateNeighbors: (state, action) => {
      state.meshNetwork.neighbors = action.payload;
    },
    updateRoutingTable: (state, action) => {
      state.meshNetwork.routingTable = { ...state.meshNetwork.routingTable, ...action.payload };
    },
    addMessageToQueue: (state, action) => {
      state.meshNetwork.messageQueue.push(action.payload);
    },
    clearMessageQueue: (state) => {
      state.meshNetwork.messageQueue = [];
    },
    setSynchronized: (state, action) => {
      state.sync.isSynchronized = action.payload;
      state.sync.lastSync = Date.now();
    },
  },
});

export const {
  connect,
  disconnect,
  addPeer,
  removePeer,
  updateNetworkStats,
  setNodeId,
  updateNeighbors,
  updateRoutingTable,
  addMessageToQueue,
  clearMessageQueue,
  setSynchronized,
} = networkSlice.actions;

export default networkSlice.reducer;