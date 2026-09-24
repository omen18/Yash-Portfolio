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
import GithubHeatmap from "./GithubHeatmap";
import OpenTo from "./OpenTo";
import HaveQuestion from "./HaveQuestion";
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
  const { isPlaying, toggleMusic } = useAudio();
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
            <GithubHeatmap />
            <Exploring />
            <AskYash />
            <OpenTo />
            <HaveQuestion />
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
