import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface AudioContextType {
  isPlaying: boolean;
  showPrompt: boolean;
  setShowPrompt: (show: boolean) => void;
  toggleMusic: () => void;
  playMusic: () => void;
  pauseMusic: () => void;
  hasInteracted: boolean;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/audio/ambient.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.20; // 20% volume is perfect for background ambient sound

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const playMusic = () => {
    setHasInteracted(true);
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Audio autoplay blocked by browser:", err);
          setIsPlaying(false);
        });
    }
  };

  const pauseMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMusic = () => {
    setHasInteracted(true);
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        showPrompt,
        setShowPrompt,
        toggleMusic,
        playMusic,
        pauseMusic,
        hasInteracted,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
