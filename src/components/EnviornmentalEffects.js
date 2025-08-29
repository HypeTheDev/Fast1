import React from 'react';

const EnvironmentalEffects = ({ effects, weather }) => {
  return (
    <div className="environmental-effects">
      {/* Weather Effects */}
      {weather === 'rainy' && <div className="rain-effect">🌧️</div>}
      {weather === 'sunny' && <div className="sun-effect">☀️</div>}
      {weather === 'cloudy' && <div className="cloud-effect">☁️</div>}
      
      {/* Music-based Environmental Effects */}
      {effects?.map((effect, index) => (
        <div
          key={index}
          className={`music-effect ${effect.type}`}
          style={{
            opacity: effect.intensity || 0.5,
            animation: `pulse ${2 + effect.intensity * 2}s infinite`
          }}
        >
          {effect.type === 'music-influence' ? '🎵' : '✨'}
        </div>
      ))}
    </div>
  );
};

export default EnvironmentalEffects;