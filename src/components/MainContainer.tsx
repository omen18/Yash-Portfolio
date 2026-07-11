import { lazy, PropsWithChildren, Suspense, useEffect, useState } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import Exploring from "./Exploring";
import AskYash from "./AskYash";
import ResearchLab from "./ResearchLab";
import OpenTo from "./OpenTo";
import setSplitText from "./utils/splitText";
import ImpactMarquee from "./ImpactMarquee";
import { useAudio } from "../context/AudioContext";
import { useLoading } from "../context/LoadingProvider";
import TechSnake from "./TechSnake";
import "./styles/Audio.css";

const TechStack = lazy(() => import("./TechStack"));

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );
  
  const { isLoading } = useLoading();
  const { isPlaying, showPrompt, setShowPrompt, toggleMusic, playMusic } = useAudio();
  const [promptDismissing, setPromptDismissing] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);

  useEffect(() => {
    const resizeHandler = () => {
      setSplitText();
      setIsDesktopView(window.innerWidth > 1024);
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [isDesktopView]);

  useEffect(() => {
    // When loading completes, show option prompt to play background music
    if (!isLoading) {
      setShowPrompt(true);
    }
  }, [isLoading, setShowPrompt]);

  const handlePlay = () => {
    setPromptDismissing(true);
    setTimeout(() => {
      playMusic();
      setShowPrompt(false);
      setPromptDismissing(false);
    }, 400); // Match CSS transition duration
  };

  const handleSilence = () => {
    setPromptDismissing(true);
    setTimeout(() => {
      setShowPrompt(false);
      setPromptDismissing(false);
    }, 400); // Match CSS transition duration
  };

  return (
    <div className="container-main">
      <Cursor />
      
      {/* Floating Background Music Control - Only visible after loading screen ends */}
      {!isLoading && (
        <button 
          className={`music-toggle-btn ${isPlaying ? "music-playing" : ""}`}
          onClick={toggleMusic}
          aria-label="Toggle background music"
        >
          <div className="equalizer">
            <span className="equalizer-bar"></span>
            <span className="equalizer-bar"></span>
            <span className="equalizer-bar"></span>
          </div>
          <span>{isPlaying ? "Music: On" : "Music: Off"}</span>
        </button>
      )}

      {/* Floating Game Trigger - Only visible after loading screen ends */}
      {!isLoading && (
        <button 
          className="game-toggle-btn"
          onClick={() => setShowGameModal(true)}
          aria-label="Play Snake Game"
        >
          <span>🎮 Play Snake</span>
        </button>
      )}

      {/* Landing Page Play/Silence Music Prompt */}
      {showPrompt && (
        <div className={`music-prompt-overlay ${promptDismissing ? "fade-out" : ""}`}>
          <div className="music-prompt-card">
            <h3>Background Music</h3>
            <p>Would you like to play ambient music to accompany your experience?</p>
            <div className="music-prompt-actions">
              <button onClick={handlePlay} className="music-prompt-btn primary">
                Play Music
              </button>
              <button onClick={handleSilence} className="music-prompt-btn secondary">
                No Thanks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Retro Arcade Game Modal */}
      {showGameModal && (
        <TechSnake onClose={() => setShowGameModal(false)} />
      )}

      <Navbar />
      <SocialIcons />
      {isDesktopView && children}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="container-main">
            <Landing>{!isDesktopView && children}</Landing>
            <About />
            <WhatIDo />
            <Career />
            <Work />
            {isDesktopView && (
              <Suspense fallback={<div>Loading....</div>}>
                <TechStack />
              </Suspense>
            )}
            <ImpactMarquee />
            <ResearchLab />
            <Exploring />
            <AskYash />
            <OpenTo />
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
