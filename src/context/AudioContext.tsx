import React, { createContext, useContext, useEffect, useRef, useState } from "react";

export interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
}

export const PLAYLIST: Track[] = [
  {
    id: "timeless",
    title: "Timeless",
    artist: "The Weeknd & Playboi Carti",
    src: "/audio/timeless.m4a",
  },
  {
    id: "circles",
    title: "Circles",
    artist: "Post Malone",
    src: "/audio/circles.m4a",
  },
  {
    id: "ambient",
    title: "Late Night Ambient",
    artist: "Lofi Beats",
    src: "/audio/ambient.mp3",
  },
];

interface AudioContextType {
  isPlaying: boolean;
  currentTrack: Track;
  currentTrackIndex: number;
  showPrompt: boolean;
  setShowPrompt: (show: boolean) => void;
  toggleMusic: () => void;
  playMusic: () => void;
  pauseMusic: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  selectTrack: (index: number) => void;
  hasInteracted: boolean;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = PLAYLIST[currentTrackIndex];

  // Initialize audio and manage track change
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(currentTrack.src);
      audioRef.current.volume = 0.35;
    } else {
      audioRef.current.src = currentTrack.src;
    }

    const handleEnded = () => {
      // Auto-advance to next track on finish
      setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    };

    audioRef.current.addEventListener("ended", handleEnded);

    if (isPlaying) {
      audioRef.current
        .play()
        .catch((err) => console.warn("Audio play prevented:", err));
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleEnded);
      }
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playMusic = () => {
    setHasInteracted(true);
    if (audioRef.current) {
      audioRef.current
        .play()
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

  const nextTrack = () => {
    setHasInteracted(true);
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setHasInteracted(true);
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const selectTrack = (index: number) => {
    setHasInteracted(true);
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        currentTrack,
        currentTrackIndex,
        showPrompt,
        setShowPrompt,
        toggleMusic,
        playMusic,
        pauseMusic,
        nextTrack,
        prevTrack,
        selectTrack,
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
