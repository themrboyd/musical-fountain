import React, { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import AudioAnalyzer from './components/AudioAnalyzer';
import Fountain from './components/Fountain';

const App = () => {
  const [audioData, setAudioData] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAudioData = useCallback((data) => {
    setAudioData(data);
  }, []);

  const handlePlayStateChange = useCallback((playing) => {
    setIsPlaying(playing);
  }, []);

  const audioInfoStyle = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    padding: '15px',
    borderRadius: '8px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    backdropFilter: 'blur(5px)',
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10 }}>
        <AudioAnalyzer 
          onAudioData={handleAudioData} 
          onPlayStateChange={handlePlayStateChange} 
        />
      </div>
      <div style={audioInfoStyle}>
        {audioData.fullSpectrum && (
          <div>Frequency Data: {audioData.fullSpectrum.length} samples</div>
        )}
        <div>Status: {isPlaying ? 'Playing' : 'Paused'}</div>
      </div>
      <Canvas
        style={{ background: '#000000', width: '100%', height: '100%' }}
        camera={{ position: [0, 2, 5], fov: 75 }}
      >
        <OrbitControls />
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, 3, -5]} intensity={0.5} color="#4040ff" />
        <Fountain audioData={audioData} isPlaying={isPlaying} />
      </Canvas>
    </div>
  );
};

export default App;