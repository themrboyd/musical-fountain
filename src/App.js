import React, { useState } from 'react';
import './App.css';
import Scene from './components/Scene';
import AudioAnalyzer from './components/AudioAnalyzer';

function App() {
  const [audioData, setAudioData] = useState(new Uint8Array(128));

  const handleAudioData = (data) => {
    setAudioData(data);
  };

  return (
    <div className="App">
      <Scene audioData={audioData} />
      <AudioAnalyzer onAudioData={handleAudioData} />
    </div>
  );
}

export default App;