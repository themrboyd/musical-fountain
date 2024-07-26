import React, { useEffect, useMemo, useState,Suspense } from 'react';
import WaterParticles from './WaterParticles';
import FountainBase from './FountainBase';
import { Html } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

const Fountain = ({ audioData, isPlaying }) => {
    const [particleKey, setParticleKey] = useState(0);
    
    const { viewport } = useThree();
    const fountainRadius = Math.min(viewport.width, viewport.height) * 0.2;
  
    useEffect(() => {
        setParticleKey(prevKey => prevKey + 1);
    }, [isPlaying]);

    useEffect(() => {
    }, [audioData]);

    const intensity = useMemo(() => {
        if (isPlaying && audioData && audioData.fullSpectrum && audioData.fullSpectrum.length > 0) {
            const avgFrequency = audioData.fullSpectrum.slice(0, 10).reduce((sum, val) => sum + val, 0) / 10;
            const calculatedIntensity = (avgFrequency / 255) * 2; // เพิ่มค่าความเข้มขึ้นเป็นสองเท่า
            
            return Math.min(calculatedIntensity, 1); // จำกัดค่าสูงสุดที่ 1
        }
        return 0.01;  // ค่าต่ำสุดเมื่อไม่มีการเล่นเพลง
    }, [isPlaying, audioData]);


    const particleCount = useMemo(() => {
        const baseCount = 5000; // เพิ่มจำนวนอนุภาคพื้นฐาน
        const maxCount = 50000; // กำหนดจำนวนอนุภาคสูงสุด
        const count = Math.floor(baseCount + intensity * (maxCount - baseCount));
        //("Particle count:", count);
        return count;
    }, [intensity]);

    return (
        <group>
            <Suspense fallback={<Html>Loading...</Html>}>
                <WaterParticles 
                    key={`${particleKey}-${particleCount}`}
                    count={particleCount}
                    color="#00ffff"
                    intensity={isPlaying ? intensity : 0.01}
                    audioData={audioData} // ส่งข้อมูลเสียงไปยัง WaterParticles
                />
                <FountainBase radius={fountainRadius} height={fountainRadius * 0.25} />
            </Suspense>
        </group>
    );
};

export default Fountain;