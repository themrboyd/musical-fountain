import React, { useState, useCallback, Suspense, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import AudioAnalyzer from './components/AudioAnalyzer';
import Fountain from './components/Fountain';
import ControlPanel from './components/ControlPanel';
import { GridHelper, AxesHelper } from 'three';

const cameraPresets = {
  default: { position: [0, 3, 6], target: [0, 0, 0] },
  front: { position: [0, 2, 8], target: [0, 1, 0] },
  top: { position: [0, 8, 0], target: [0, 0, 0] },
  side: { position: [8, 2, 0], target: [0, 1, 0] },
  closeup: { position: [0, 1, 3], target: [0, 1, 0] },
  dramatic: { position: [-5, 4, 5], target: [0, 1, 0] },
};

const CameraController = ({ preset }) => {
  const { camera, controls } = useThree();
  const targetRef = useRef(cameraPresets[preset] || cameraPresets.default);

  useEffect(() => {
    const targetPreset = cameraPresets[preset] || cameraPresets.default;
    targetRef.current = targetPreset;

    const animateCamera = () => {
      const startPos = camera.position.clone();
      const startTarget = controls?.target.clone() || new THREE.Vector3(0, 0, 0);
      const endPos = new THREE.Vector3(...targetPreset.position);
      const endTarget = new THREE.Vector3(...targetPreset.target);
      
      let progress = 0;
      const duration = 1.5;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = (currentTime - startTime) / 1000;
        progress = Math.min(elapsed / duration, 1);
        
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        camera.position.lerpVectors(startPos, endPos, easedProgress);
        if (controls) {
          controls.target.lerpVectors(startTarget, endTarget, easedProgress);
          controls.update();
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    };

    animateCamera();
  }, [preset, camera, controls]);

  return null;
};
// สร้าง Loading component สำหรับแสดงระหว่างโหลด
const Loader = () => {
  return (
    <Html center>
      <div style={{
        color: 'white',
        fontSize: '24px'
      }}>
        Loading...
      </div>
    </Html>
  );
};

const App = () => {
  const [audioData, setAudioData] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [bloomEnabled, setBloomEnabled] = useState(true);
  const [bloomIntensity, setBloomIntensity] = useState(1.5);
  const [fountainPattern, setFountainPattern] = useState('spray');
  const [waterColor, setWaterColor] = useState('#00ffff');
  const [particleCount, setParticleCount] = useState(25000);
  const [gravity, setGravity] = useState(0.3);
  const [cameraPreset, setCameraPreset] = useState('default');
  const [autoPattern, setAutoPattern] = useState(false);

  const handleAudioData = useCallback((data) => {
    setAudioData(data);
  }, []);

  const handlePlayStateChange = useCallback((playing) => {
    setIsPlaying(playing);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10 }}>
        <AudioAnalyzer 
          onAudioData={handleAudioData} 
          onPlayStateChange={handlePlayStateChange} 
        />
      </div>
      <ControlPanel
        bloomEnabled={bloomEnabled}
        setBloomEnabled={setBloomEnabled}
        bloomIntensity={bloomIntensity}
        setBloomIntensity={setBloomIntensity}
        fountainPattern={fountainPattern}
        setFountainPattern={setFountainPattern}
        waterColor={waterColor}
        setWaterColor={setWaterColor}
        particleCount={particleCount}
        setParticleCount={setParticleCount}
        gravity={gravity}
        setGravity={setGravity}
        cameraPreset={cameraPreset}
        setCameraPreset={setCameraPreset}
        autoPattern={autoPattern}
        setAutoPattern={setAutoPattern}
      />
      <Canvas
        style={{ background: '#000000', width: '100%', height: '100%' }}
        camera={{ position: [0, 3, 6], fov: 60 }}
      >
        <Suspense fallback={<Loader />}>
          <CameraController preset={cameraPreset} />
          <OrbitControls />
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={0.8} />
          <pointLight position={[-5, 3, -5]} intensity={0.5} color="#4040ff" />
          <Fountain 
            audioData={audioData} 
            isPlaying={isPlaying} 
            fountainPattern={fountainPattern}
            waterColor={waterColor}
            particleCount={particleCount}
            gravity={gravity}
          />
          <Environment
            scale={100}
            intensity={11.5}
            files={[
              '/images/envmap/px.jpg',
              '/images/envmap/nx.jpg',
              '/images/envmap/py.jpg',
              '/images/envmap/ny.jpg',
              '/images/envmap/pz.jpg',
              '/images/envmap/nz.jpg'
            ]} background /> 
        </Suspense>
        {bloomEnabled && (
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.3}
              luminanceSmoothing={0.9}
              height={300}
              intensity={bloomIntensity}
            />
          </EffectComposer>
        )}
        <primitive object={new GridHelper(10, 10)} />
        <primitive object={new AxesHelper(5)} />
      </Canvas>
    </div>
  );
};

export default App;