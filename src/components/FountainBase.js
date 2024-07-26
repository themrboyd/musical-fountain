import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FountainBase = ({ radius = 2, height = 0.5 }) => {
  const meshRef = useRef();
  const waterSurfaceRef = useRef();

  const createRipple = (x, z, time, strength = 0.05, wavelength = 0.5) => {
    const distance = Math.sqrt(x * x + z * z);
    const ripple = Math.sin(distance * wavelength - time * 10) * strength;
    return ripple * Math.exp(-distance * 0.2); // ลดความแรงของคลื่นตามระยะทาง
  };
  
  // สร้างรูปทรงของอ่างน้ำพุ
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(radius, 0);
    shape.bezierCurveTo(radius + 0.2, 0, radius + 0.2, height, radius, height);
    shape.lineTo(radius - 0.2, height);
    shape.bezierCurveTo(radius - 0.3, height, radius - 0.3, height - 0.1, radius - 0.4, height - 0.1);
    shape.lineTo(0, height - 0.1);
    shape.lineTo(0, 0);

    const extrudeSettings = {
      steps: 2,
      depth: 0.2,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 10
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [radius, height]);

  // สร้างผิวน้ำ
  const waterGeometry = useMemo(() => {
    return new THREE.PlaneGeometry(radius * 2 - 0.1, radius * 2 - 0.1, 32, 32);
  }, [radius]);

  useFrame((state, delta) => {
    // เพิ่มการเคลื่อนไหวให้กับผิวน้ำ
    const time = state.clock.getElapsedTime();
    const positions = waterSurfaceRef.current.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const z = positions[i + 2];
      positions[i + 1] = Math.sin(x * 2 + time) * 0.03 + 
                        Math.sin(z * 2 + time * 1.5) * 0.03 +
                        createRipple(x, z, time);
    }
    waterSurfaceRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry} position={[0, -height, 0]}>
        <meshPhongMaterial 
          color="#a0a0ff"
          specular="#ffffff"
          shininess={100}
          emissive="#404080"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh ref={waterSurfaceRef} geometry={waterGeometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <meshPhysicalMaterial
          color="#80dbff"
          transparent
          opacity={0.8}
          roughness={0.1}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={0.5}
        />
      </mesh>
    </group>
  );
};

export default FountainBase;