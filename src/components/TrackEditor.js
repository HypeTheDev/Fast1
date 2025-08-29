import React from 'react';

const TrackEditor = ({ trackId, onParameterChange }) => {
  return (
    <div className="track-editor">
      <h4>Track Editor - {trackId}</h4>
      
      <div className="editor-controls">
        <div className="control-group">
          <label>Volume</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            onChange={(e) => onParameterChange('volume', parseFloat(e.target.value))}
          />
        </div>
        
        <div className="control-group">
          <label>Pan</label>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.1"
            onChange={(e) => onParameterChange('pan', parseFloat(e.target.value))}
          />
        </div>
        
        <div className="control-group">
          <label>Pitch</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            onChange={(e) => onParameterChange('pitch', parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default TrackEditor;