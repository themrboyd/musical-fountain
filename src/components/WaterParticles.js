import React, { useRef, useMemo, useCallback, useEffect } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { vertexShader, fragmentShader } from '../shaders.js';
import { useTexture, useCubeTexture } from '@react-three/drei';

const WaterParticles = ({ count = 50000, color = '#00ffff', intensity = 0.5, audioData }) => {

    const mesh = useRef();
    const light = useRef();
    const { gl } = useThree();

    const texture = useLoader(TextureLoader, '/images/water_drop_texture.png');
    const envMap = useCubeTexture(
        ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'],
        { path: '/images/envmap/' }
    );

    const resetParticle = useCallback((index, positions, velocities, sizes) => {
        const i3 = index * 3;
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.1;
      
        positions[i3] = Math.cos(angle) * radius || 0;
        positions[i3 + 1] = 0;
        positions[i3 + 2] = Math.sin(angle) * radius || 0;
      
        const speed = Math.random() * 0.5 + 0.5;
        velocities[i3] = (Math.cos(angle) * speed * 0.1) || 0;
        velocities[i3 + 1] = speed || 0.1;
        velocities[i3 + 2] = (Math.sin(angle) * speed * 0.1) || 0;
      
        sizes[index] = Math.random() * 0.1 + 0.05 || 0.05;
    }, []);


    const resetAllParticles = useCallback(() => {
        if (mesh.current) {
            const positions = mesh.current.geometry.attributes.position.array;
            const velocities = mesh.current.geometry.attributes.velocity.array;
            const sizes = mesh.current.geometry.attributes.size.array;

            for (let i = 0; i < count; i++) {
                resetParticle(i, positions, velocities, sizes);
            }

            mesh.current.geometry.attributes.position.needsUpdate = true;
            mesh.current.geometry.attributes.velocity.needsUpdate = true;
            mesh.current.geometry.attributes.size.needsUpdate = true;
        }
    }, [count, resetParticle]);

    const particleSystem = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
    
        for (let i = 0; i < count; i++) {
            resetParticle(i, positions, velocities, sizes);
        }
    
       // ตรวจสอบค่า NaN
        for (let i = 0; i < positions.length; i++) {
            if (isNaN(positions[i])) {
                console.warn(`NaN detected in position at index ${i}`);
                positions[i] = 0;
            }
        }
    
        return { positions, velocities, sizes };
    }, [count, resetParticle]);

    
    const timeRef = useRef(0);

    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                diffuseTexture: { value: texture },
                envMap: { value: envMap },
                color: { value: new THREE.Color(color) },
                time: { value: 0 },
                intensity: { value: intensity },
                lightPosition: { value: new THREE.Vector3(5, 5, 5) },
            },
            vertexShader,
            fragmentShader,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
    }, [texture, envMap, color, intensity]);

    useEffect(() => {
        if (intensity < 0.01) {
            resetAllParticles();
        }
    }, [intensity, resetAllParticles]);

    useFrame((state, delta) => {
        
        if (intensity < 0.01) {
            return;
        }

        timeRef.current += delta;
        
        if (mesh.current) {
            const positions = mesh.current.geometry.attributes.position.array;
            const velocities = mesh.current.geometry.attributes.velocity.array;
            const sizes = mesh.current.geometry.attributes.size.array;
    
            const bassIntensity = audioData ? audioData.bass / 255 : 0.5;
            const midIntensity = audioData ? audioData.mid / 255 : 0.5;
            const trebleIntensity = audioData ? audioData.treble / 255 : 0.5;
    
            for (let i = 0; i < count; i++) {
                const i3 = i * 3;
    
                velocities[i3] *= 0.99;
                velocities[i3 + 1] -= 9.81 * delta * 0.05 * (1 - midIntensity);
                velocities[i3 + 2] *= 0.99;
    
                const waveOffset = Math.sin(timeRef.current * 2 + i * 0.1) * 0.02;
    
                // ป้องกันค่า NaN
                positions[i3] = isNaN(positions[i3]) ? 0 : positions[i3] + velocities[i3] * intensity * delta;
                positions[i3 + 1] = isNaN(positions[i3 + 1]) ? 0 : positions[i3 + 1] + (velocities[i3 + 1] + waveOffset) * intensity * delta;
                positions[i3 + 2] = isNaN(positions[i3 + 2]) ? 0 : positions[i3 + 2] + velocities[i3 + 2] * intensity * delta;
    
                if (positions[i3 + 1] < 0 || 
                    Math.abs(positions[i3]) > 1 || 
                    Math.abs(positions[i3 + 2]) > 1 ||
                    positions[i3 + 1] > 5 + bassIntensity * 2 ||
                    isNaN(positions[i3]) || isNaN(positions[i3 + 1]) || isNaN(positions[i3 + 2])) {
                    resetParticle(i, positions, velocities, sizes);
                }
            }
    
            mesh.current.geometry.attributes.position.needsUpdate = true;
            mesh.current.geometry.attributes.velocity.needsUpdate = true;
            mesh.current.material.uniforms.time.value = timeRef.current;
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
                    count={particleSystem.positions.length / 3}
                    array={particleSystem.positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-velocity"
                    count={particleSystem.velocities.length / 3}
                    array={particleSystem.velocities}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-size"
                    count={particleSystem.sizes.length}
                    array={particleSystem.sizes}
                    itemSize={1}
                />
            </bufferGeometry>
                <shaderMaterial args={[shaderMaterial]} />
            </points>
            <pointLight ref={light} distance={6} intensity={2 * intensity} color={color} />
        </group>
    );
};

export default WaterParticles;