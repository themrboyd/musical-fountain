// FountainBase.js
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FountainBase = ({ radius = 2, height = 0.5 }) => {
  const meshRef = useRef();
  const waterSurfaceRef = useRef();

  // สร้างรูปทรงของอ่างน้ำพุ
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(radius, 0);
    shape.lineTo(radius, height);
    shape.lineTo(radius - 0.2, height);
    shape.lineTo(radius - 0.3, height - 0.1);
    shape.lineTo(0, height - 0.1);
    shape.lineTo(0, 0);

    const extrudeSettings = {
      steps: 1,
      depth: 0.2,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelSegments: 5
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [radius, height]);

  // สร้างผิวน้ำ
  const waterGeometry = useMemo(() => {
    return new THREE.PlaneGeometry(radius * 2, radius * 2, 32, 32);
  }, [radius]);

  useFrame((state, delta) => {
    // เพิ่มการเคลื่อนไหวให้กับผิวน้ำ
    const time = state.clock.getElapsedTime();
    const positions = waterSurfaceRef.current.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const z = positions[i + 2];
      positions[i + 1] = Math.sin(x + time) * 0.1 + Math.sin(z + time) * 0.1;
    }
    waterSurfaceRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry} position={[0, -height, 0]}>
        <meshStandardMaterial 
          color="#a0a0ff"  // ปรับสีให้สว่างขึ้น
          roughness={0.2} 
          metalness={0.8}
          emissive="#404080"  // เพิ่มการเรืองแสงเล็กน้อย
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh ref={waterSurfaceRef} geometry={waterGeometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <meshPhysicalMaterial
          color="#80dbff"  // ปรับสีน้ำให้สว่างขึ้น
          transparent
          opacity={0.7}
          roughness={0.1}
          metalness={0.3}
          transmission={0.5}
          emissive="#4080ff"  // เพิ่มการเรืองแสงให้กับน้ำ
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
};

export default FountainBase;