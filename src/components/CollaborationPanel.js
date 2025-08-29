import React from 'react';

const CollaborationPanel = ({ peers, currentSession }) => {
  return (
    <div className="collaboration-panel">
      <h4>Collaboration</h4>
      
      <div className="session-info">
        {currentSession ? (
          <div>
            <p>Session: {currentSession.id}</p>
            <p>Participants: {currentSession.participants?.length || 0}</p>
          </div>
        ) : (
          <p>No active session</p>
        )}
      </div>
      
      <div className="peers-list">
        <h5>Connected Peers</h5>
        {Array.from(peers.values()).map(peer => (
          <div key={peer.id} className="peer-item">
            <span>{peer.name || `Peer ${peer.id.slice(0, 8)}`}</span>
            <div className={`peer-status ${peer.connected ? 'online' : 'offline'}`}>
              {peer.connected ? '🟢' : '🔴'}
            </div>
          </div>
        ))}
      </div>
      
      <div className="collaboration-actions">
        <button>Start Session</button>
        <button>Invite Peers</button>
        <button>Share Track</button>
      </div>
    </div>
  );
};

export default CollaborationPanel;