import React from 'react';
import styles from '../ControlPanel.module.css';

const ControlPanel = ({ 
  bloomEnabled, 
  setBloomEnabled, 
  bloomIntensity, 
  setBloomIntensity,
  fountainPattern, 
  setFountainPattern,
  waterColor, 
  setWaterColor,
  particleCount, 
  setParticleCount,
  gravity, 
  setGravity,
  cameraPreset, 
  setCameraPreset,
  autoPattern,
  setAutoPattern
}) => {
  const patterns = [
    { value: 'spray', label: 'Spray' },
    { value: 'cascade', label: 'Cascade' },
    { value: 'jet', label: 'Jet' },
    { value: 'circular', label: 'Circular' },
  ];

  const cameraPresets = [
    { value: 'default', label: 'Default' },
    { value: 'front', label: 'Front View' },
    { value: 'top', label: 'Top View' },
    { value: 'side', label: 'Side View' },
    { value: 'closeup', label: 'Close-up' },
    { value: 'dramatic', label: 'Dramatic' },
  ];

  return (
    <div className={styles.panel}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>🌟 Bloom Effect</h3>
        <label className={styles.switchLabel}>
          <input
            type="checkbox"
            checked={bloomEnabled}
            onChange={(e) => setBloomEnabled(e.target.checked)}
            className={styles.switch}
          />
          Enable Bloom
        </label>
        {bloomEnabled && (
          <div className={styles.control}>
            <label>Intensity: {bloomIntensity}</label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={bloomIntensity}
              onChange={(e) => setBloomIntensity(parseFloat(e.target.value))}
              className={styles.range}
            />
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>💧 Fountain Pattern</h3>
        <div className={styles.patternButtons}>
          {patterns.map((pattern) => (
            <button
              key={pattern.value}
              className={`${styles.patternButton} ${fountainPattern === pattern.value ? styles.active : ''}`}
              onClick={() => setFountainPattern(pattern.value)}
            >
              {pattern.label}
            </button>
          ))}
        </div>
        <label className={styles.switchLabel}>
          <input
            type="checkbox"
            checked={autoPattern}
            onChange={(e) => setAutoPattern(e.target.checked)}
            className={styles.switch}
          />
          Auto-switch on beat
        </label>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>🎨 Water Color</h3>
        <div className={styles.colorButtons}>
          {[
            { value: '#ffffff', label: 'White' },
            { value: '#00aaff', label: 'Blue' },
            { value: '#00ffaa', label: 'Cyan' },
            { value: '#ff00ff', label: 'Purple' },
            { value: '#ffff00', label: 'Yellow' },
            { value: '#ff6600', label: 'Orange' },
          ].map((color) => (
            <button
              key={color.value}
              className={`${styles.colorButton} ${waterColor === color.value ? styles.active : ''}`}
              style={{ backgroundColor: color.value }}
              onClick={() => setWaterColor(color.value)}
              title={color.label}
            />
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>⚡ Physics</h3>
        <div className={styles.control}>
          <label>Particles: {particleCount}</label>
          <input
            type="range"
            min="5000"
            max="50000"
            step="5000"
            value={particleCount}
            onChange={(e) => setParticleCount(parseInt(e.target.value))}
            className={styles.range}
          />
        </div>
        <div className={styles.control}>
          <label>Gravity: {gravity}</label>
          <input
            type="range"
            min="0.1"
            max="0.5"
            step="0.05"
            value={gravity}
            onChange={(e) => setGravity(parseFloat(e.target.value))}
            className={styles.range}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>🎥 Camera</h3>
        <div className={styles.cameraPresets}>
          {cameraPresets.map((preset) => (
            <button
              key={preset.value}
              className={`${styles.cameraButton} ${cameraPreset === preset.value ? styles.active : ''}`}
              onClick={() => setCameraPreset(preset.value)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
