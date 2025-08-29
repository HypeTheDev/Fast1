import React from 'react';

const InteractiveElements = ({ player, onInteraction }) => {
  const elements = [
    {
      id: 'music-studio',
      name: 'Music Studio',
      position: { x: 10, y: 0, z: 10 },
      icon: '🎵'
    },
    {
      id: 'performance-stage',
      name: 'Performance Stage',
      position: { x: -10, y: 0, z: 10 },
      icon: '🎤'
    },
    {
      id: 'network-hub',
      name: 'Network Hub',
      position: { x: 0, y: 0, z: -10 },
      icon: '🌐'
    }
  ];

  return (
    <div className="interactive-elements">
      {elements.map(element => (
        <button
          key={element.id}
          className="interactive-element"
          onClick={() => onInteraction({ type: element.id, element })}
          style={{
            position: 'absolute',
            left: `${50 + element.position.x * 10}%`,
            top: `${50 + element.position.z * 10}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="element-icon">{element.icon}</div>
          <div className="element-name">{element.name}</div>
        </button>
      ))}
    </div>
  );
};

export default InteractiveElements;