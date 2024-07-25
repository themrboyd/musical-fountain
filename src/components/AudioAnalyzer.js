import React, { useRef, useEffect, useState } from 'react';
import styles from '../AudioAnalyzer.module.css';

// รายการเพลง default
const defaultSongs = [
  { name: "Song 1", url: "/musics/spa1.mp3" },
  { name: "Song 2", url: "/musics/science-documentary-169621.mp3" },
  { name: "Song 3", url: "/musics/funny-running-129223.mp3" },
  { name: "Song 4", url: "/musics/mozart-piano-sonata-11-3-played-by-brass-ensemble-7635.mp3" },
  { name: "Song 5", url: "/musics/fur-elise-beethoven-216331.mp3" },
  { name: "Song 6", url: "/musics/big-jason-slap-house-version-background-music-for-video-vlog-52-sec-223904.mp3" },
  { name: "Song 7", url: "/musics/glossy-168156.mp3" },
  { name: "Song 8", url: "/musics/perfect-beauty-191271.mp3" },
];

const AudioAnalyzer = ({ onAudioData, onPlayStateChange }) => {
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSong, setSelectedSong] = useState(defaultSongs[0]);
  const [isInitialized, setIsInitialized] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
    }
  };

  useEffect(() => {
    let animationId;

    const updateAudioData = () => {
      if (analyserRef.current && isPlaying) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);
        
        const bass = averageFrequencyRange(dataArray, 0, 200);
        const mid = averageFrequencyRange(dataArray, 200, 2000);
        const treble = averageFrequencyRange(dataArray, 2000, 20000);
        const beat = detectBeat(dataArray);
        
        onAudioData({ bass, mid, treble, beat, fullSpectrum: dataArray });
      }
      animationId = requestAnimationFrame(updateAudioData);
    };

    if (isPlaying) {
      updateAudioData();
    }

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, onAudioData]);

  const averageFrequencyRange = (dataArray, startFreq, endFreq) => {
    const startIndex = Math.floor(startFreq / 22050 * dataArray.length);
    const endIndex = Math.floor(endFreq / 22050 * dataArray.length);
    let sum = 0;
    for (let i = startIndex; i <= endIndex; i++) {
      sum += dataArray[i];
    }
    return sum / (endIndex - startIndex + 1);
  };

  const detectBeat = (dataArray) => {
    const bassAvg = averageFrequencyRange(dataArray, 0, 150);
    return bassAvg > 200;
  };

  const setupAudioNodes = async () => {
    
    initAudioContext();
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    
    if (!sourceRef.current) {
      sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }
    
  };

  const playAudio = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await setupAudioNodes();
      await audioRef.current.play();
      setIsPlaying(true);
      onPlayStateChange(true);
    } catch (error) {
      console.error("Error playing audio:", error);
      setError("Failed to play audio. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleSongChange = (event) => {
    const selectedSongUrl = event.target.value;
    const song = defaultSongs.find(s => s.url === selectedSongUrl) || { name: "Custom", url: selectedSongUrl };
    setSelectedSong(song);
    console.log('Song changed to:', song.name);
    
    if (audioRef.current) {
      audioRef.current.src = song.url;
      audioRef.current.load();
      setIsLoading(true);
      audioRef.current.oncanplaythrough = () => {
        setIsLoading(false);
        if (isPlaying) {
          playAudio();
        }
      };
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const audioUrl = URL.createObjectURL(file);
      setSelectedSong({ name: file.name, url: audioUrl });
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
        if (isPlaying) {
          playAudio();
        }
      }
    }
  };

  const togglePlayPause = async () => {
    if (!isInitialized) {
      setIsInitialized(true);
      await setupAudioNodes();
    }

    if (audioRef.current) {
      if (audioRef.current.paused) {
        try {
          await playAudio();
        } catch (error) {
          console.error("Error resuming audio:", error);
          setError("Failed to resume audio. Please try again.");
        }
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
        onPlayStateChange(false);
      }
    }
  };

  useEffect(() => {
    audioRef.current = new Audio(selectedSong.url);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <select 
          className={styles.select} 
          onChange={handleSongChange} 
          value={selectedSong.url}
        >
          {defaultSongs.map((song, index) => (
            <option key={index} value={song.url}>{song.name}</option>
          ))}
        </select>
        <label className={styles.uploadLabel}>
          Upload
          <input 
            type="file" 
            accept="audio/*" 
            onChange={handleFileUpload} 
            className={styles.fileInput}
          />
        </label>
        <button 
          className={styles.playButton}
          onClick={togglePlayPause} 
          disabled={isLoading}
        >
          {isLoading ? "..." : isPlaying ? "Pause" : "Play"}
        </button>
      </div>
      <div className={styles.info}>
        <span>Now Playing: {selectedSong.name}</span>
        <span>Status: {isPlaying ? "Playing" : "Paused"}</span>
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );

  
};

export default AudioAnalyzer;