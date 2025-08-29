import React from 'react';
import { useNetwork } from '../contexts/NetworkContext';

const NetworkStatus = () => {
  const { state: networkState } = useNetwork();

  return (
    <div className="network-status-bar">
      <div className="status">
        {networkState.isConnected ? '🟢' : '🔴'} 
        {networkState.peers.size} peers
      </div>
    </div>
  );
};

export default NetworkStatus;