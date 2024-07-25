// WaterParticles.js
import React, { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  attribute float size;
  varying vec3 vColor;
  uniform vec3 color;

  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  uniform sampler2D diffuseTexture;  // Changed name from 'texture' to 'diffuseTexture'
  varying vec3 vColor;

  void main() {
    vec4 texColor = texture2D(diffuseTexture, gl_PointCoord);  // Use the new name here
    gl_FragColor = vec4(vColor, texColor.a);
  }
`;

const WaterParticles = ({ count = 5000, color = '#00ffff', intensity = 0.5 }) => {
    const mesh = useRef();
    const light = useRef();
    const { gl } = useThree();
    const texture = useLoader(THREE.TextureLoader, '/images/water_drop_texture.png');

  const resetParticle = useCallback((index, positions, velocities, sizes) => {
    const i3 = index * 3;
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 0.5;

    positions[i3] = Math.cos(angle) * radius;
    positions[i3 + 1] = 0;
    positions[i3 + 2] = Math.sin(angle) * radius;

    const speed = Math.random() * 0.05 + 0.05;
    velocities[i3] = Math.cos(angle) * speed * 0.2;
    velocities[i3 + 1] = speed;
    velocities[i3 + 2] = Math.sin(angle) * speed * 0.2;

    sizes[index] = Math.random() * 0.05 + 0.02;
  }, []);

  const particleSystem = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      resetParticle(i, positions, velocities, sizes);
    }

    return { positions, velocities, sizes };
  }, [count, resetParticle]);

  const shaderMaterial = useMemo(() => {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        diffuseTexture: { value: texture },
        color: { value: new THREE.Color(color) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // Explicitly set index0AttributeName to null
    material.index0AttributeName = null;

    return material;
  }, [texture, color]);
    useFrame((state, delta) => {
        if (mesh.current) {
            const positions = mesh.current.geometry.attributes.position.array;
            const velocities = mesh.current.geometry.attributes.velocity.array;
            const sizes = mesh.current.geometry.attributes.size.array;

            for (let i = 0; i < count; i++) {
                const i3 = i * 3;

                // Apply gravity and air resistance
                velocities[i3] *= 0.99;
                velocities[i3 + 1] -= 9.81 * delta * 0.1;
                velocities[i3 + 2] *= 0.99;

                // Update position
                positions[i3] += velocities[i3] * intensity;
                positions[i3 + 1] += velocities[i3 + 1] * intensity;
                positions[i3 + 2] += velocities[i3 + 2] * intensity;

                // Reset particle if it goes below the base
                if (positions[i3 + 1] < 0) {
                    resetParticle(i, positions, velocities, sizes);
                }

                // Update size based on velocity
                sizes[i] = Math.max(0.02, Math.min(0.07, sizes[i] + velocities[i3 + 1] * 0.001));
            }

            mesh.current.geometry.attributes.position.needsUpdate = true;
            mesh.current.geometry.attributes.velocity.needsUpdate = true;
            mesh.current.geometry.attributes.size.needsUpdate = true;
        }

        if (light.current) {
            light.current.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.01 * intensity);
        }
    });
 
    return (
        <group>
            <points ref={mesh}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={count}
                        array={particleSystem.positions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-velocity"
                        count={count}
                        array={particleSystem.velocities}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-size"
                        count={count}
                        array={particleSystem.sizes}
                        itemSize={1}
                    />
                </bufferGeometry>
                <primitive object={shaderMaterial} attach="material" />
            </points>
            <pointLight ref={light} distance={6} intensity={2 * intensity} color={color} />
        </group>
    );

  
};

export default WaterParticles;