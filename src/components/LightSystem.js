// LightSystem.js
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const LightSystem = ({ audioData, intensity = 1 }) => {
  const groupRef = useRef();
  const lightRefs = useRef([]);

  // สร้างไฟ LED จำนวน 8 ดวง
  const lights = useMemo(() => {
    return Array(8).fill().map((_, index) => {
      const angle = (index / 8) * Math.PI * 2;
      const radius = 2; // รัศมีของวงกลมที่จะวางไฟ
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      return new THREE.PointLight(0xffffff, 0, 3); // สี, ความเข้ม (เริ่มต้นที่ 0), ระยะ
    });
  }, []);

  useEffect(() => {
    lights.forEach((light, index) => {
      const angle = (index / 8) * Math.PI * 2;
      const radius = 2;
      light.position.set(
        Math.cos(angle) * radius,
        0.5, // ความสูงของไฟเหนือฐานน้ำพุ
        Math.sin(angle) * radius
      );
      groupRef.current.add(light);
    });
    lightRefs.current = lights;
  }, [lights]);

  useFrame(() => {
    if (audioData && audioData.fullSpectrum) {
      // แบ่งสเปกตรัมเสียงเป็น 8 ส่วนสำหรับไฟแต่ละดวง
      const spectrumChunk = Math.floor(audioData.fullSpectrum.length / 8);
      
      lightRefs.current.forEach((light, index) => {
        // คำนวณความเข้มของแสงจากค่าเฉลี่ยของช่วงความถี่
        const start = index * spectrumChunk;
        const end = start + spectrumChunk;
        const avgIntensity = audioData.fullSpectrum
          .slice(start, end)
          .reduce((sum, val) => sum + val, 0) / spectrumChunk;
        
        // ปรับความเข้มของแสง
        light.intensity = (avgIntensity / 255) * intensity * 2;
        
        // เปลี่ยนสีของแสงตามความถี่
        const hue = index / 8;
        const color = new THREE.Color().setHSL(hue, 1, 0.5);
        light.color = color;
      });
    }
  });

  return <group ref={groupRef} />;
};

export default LightSystem;