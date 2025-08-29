import React from 'react';

const EffectPanel = ({ trackId, effects }) => {
  return (
    <div className="effect-panel">
      <h4>Audio Effects</h4>
      
      <div className="effects-list">
        {Object.entries(effects).map(([effectName, effectData]) => (
          <div key={effectName} className="effect-item">
            <label>
              <input
                type="checkbox"
                checked={effectData?.enabled || false}
                onChange={(e) => {
                  // This would connect to the audio context to toggle effects
                  console.log(`Toggle ${effectName}:`, e.target.checked);
                }}
              />
              {effectName.charAt(0).toUpperCase() + effectName.slice(1)}
            </label>
            
            {effectData?.enabled && (
              <div className="effect-controls">
                {Object.entries(effectData).map(([param, value]) => {
                  if (param === 'enabled') return null;
                  return (
                    <div key={param} className="effect-param">
                      <label>{param}</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={value}
                        onChange={(e) => {
                          // This would connect to the audio context
                          console.log(`Set ${effectName}.${param}:`, e.target.value);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EffectPanel;