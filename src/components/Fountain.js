import React, { useEffect, useMemo, useState } from 'react';
import WaterParticles from './WaterParticles';
import FountainBase from './FountainBase';

const Fountain = ({ audioData, isPlaying }) => {
    const [particleKey, setParticleKey] = useState(0);
    
    
    useEffect(() => {
        setParticleKey(prevKey => prevKey + 1);
    }, [isPlaying]);

    useEffect(() => {
    }, [audioData]);

    const intensity = useMemo(() => {
        if (isPlaying && audioData && audioData.fullSpectrum && audioData.fullSpectrum.length > 0) {
            const avgFrequency = audioData.fullSpectrum.slice(0, 10).reduce((sum, val) => sum + val, 0) / 10;
            const calculatedIntensity = avgFrequency / 255;
            return calculatedIntensity;
        }
        return 0.5;
    }, [isPlaying, audioData]);

    const particleCount = useMemo(() => {
        const count = Math.floor(1000 + intensity * 4000);
        console.log("Particle count:", count);
        return count;
    }, [intensity]);

    return (
        <group>
            <WaterParticles 
                key={`${particleKey}-${particleCount}`}
                count={particleCount}
                color="#00ffff"
                intensity={isPlaying ? intensity : 0.5}
            />
            <FountainBase radius={2} height={0.5} />
        </group>
    );
};

export default Fountain;