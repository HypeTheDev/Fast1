import React from 'react';

const ParameterControls = ({ trackId, onChange }) => {
  return (
    <div className="parameter-controls">
      <h4>Parameter Controls</h4>
      
      <div className="controls-grid">
        <div className="control-item">
          <label>Reverb Wet</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            onChange={(e) => onChange('reverbWet', parseFloat(e.target.value))}
          />
        </div>
        
        <div className="control-item">
          <label>Delay Time</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            onChange={(e) => onChange('delayTime', parseFloat(e.target.value))}
          />
        </div>
        
        <div className="control-item">
          <label>Filter Frequency</label>
          <input
            type="range"
            min="20"
            max="20000"
            step="10"
            onChange={(e) => onChange('filterFrequency', parseFloat(e.target.value))}
          />
        </div>
        
        <div className="control-item">
          <label>Distortion Amount</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            onChange={(e) => onChange('distortion', parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default ParameterControls;