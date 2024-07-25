import React, { useRef, useEffect, useState } from 'react';

const AudioAnalyzer = ({ onAudioData }) => {
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      // สร้าง AudioContext และ Analyser เมื่อ component mount
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      setIsInitialized(true);
    }

    // ฟังก์ชันสำหรับอัพเดตข้อมูลเสียง
    const updateAudioData = () => {
      if (analyserRef.current) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        onAudioData(dataArray);
      }
      requestAnimationFrame(updateAudioData);
    };

    // เริ่มการอัพเดตข้อมูลเสียง
    const animationId = requestAnimationFrame(updateAudioData);

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationId);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(e => console.error("Error closing AudioContext:", e));
      }
    };
  }, [isInitialized, onAudioData]);

  // ฟังก์ชันสำหรับเริ่มเล่นเพลง
  const playAudio = (audioElement) => {
    if (audioContextRef.current && analyserRef.current) {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      const source = audioContextRef.current.createMediaElementSource(audioElement);
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }
  };

  return (
    <div>
      <input type="file" accept="audio/*" onChange={(e) => {
        const file = e.target.files[0];
        if (file) {
          const audio = new Audio(URL.createObjectURL(file));
          audio.addEventListener('canplaythrough', () => {
            playAudio(audio);
            audio.play().catch(e => console.error("Error playing audio:", e));
          });
        }
      }} />
    </div>
  );
};

export default AudioAnalyzer;