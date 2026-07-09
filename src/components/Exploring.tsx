import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/Exploring.css";

gsap.registerPlugin(ScrollTrigger);

type Track = {
  title: string;
  subtitle: string;
  duration: string;
  durationSeconds: number;
  tags: string[];
};

const learningTracks: Track[] = [
  {
    title: "Transformers",
    subtitle: "Attention behavior, token dynamics, and practical model debugging.",
    duration: "3:45",
    durationSeconds: 225,
    tags: ["Attention", "Token Flow", "BERT", "GPT", "Debugging"],
  },
  {
    title: "AI Agents",
    subtitle: "Tool-using systems that can plan, remember, act, and explain decisions.",
    duration: "2:51",
    durationSeconds: 171,
    tags: ["LangChain", "Tool Use", "Memory", "Planning", "ReAct"],
  },
  {
    title: "Interpretability",
    subtitle: "Small experiments that make neural models easier to inspect and compare.",
    duration: "4:10",
    durationSeconds: 250,
    tags: ["Probing", "Feature Viz", "Mechanistic", "Ablation", "Circuits"],
  },
  {
    title: "Autonomous Systems",
    subtitle: "Perception, feedback loops, and edge intelligence for messy environments.",
    duration: "3:15",
    durationSeconds: 195,
    tags: ["Perception", "Edge AI", "Sensors", "Control", "Safety"],
  },
];

// Formats seconds to mm:ss format
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const Exploring = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const progressBgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [trackIndex, setTrackIndex] = useState(0);
  const [elapsed, setElapsed] = useState(43); // Start at 0:43 as requested
  const [isPlaying, setIsPlaying] = useState(true);

  const currentTrack = learningTracks[trackIndex];

  // Skip track transition helper with premium GSAP fade and slide stagger
  const changeTrack = useCallback((newIndex: number) => {
    const content = contentRef.current;
    if (!content) {
      setTrackIndex(newIndex);
      setElapsed(0);
      return;
    }

    // Slide/fade out
    gsap.to(content.querySelectorAll(".exploring-track-title, .exploring-track-subtitle, .exploring-player-tag"), {
      opacity: 0,
      y: -10,
      duration: 0.25,
      stagger: 0.05,
      ease: "power2.in",
      onComplete: () => {
        setTrackIndex(newIndex);
        setElapsed(0);
        
        // Slide/fade back in
        gsap.fromTo(
          content.querySelectorAll(".exploring-track-title, .exploring-track-subtitle, .exploring-player-tag"),
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power3.out",
          }
        );
      }
    });
  }, []);

  const handleNext = useCallback(() => {
    const nextIdx = (trackIndex + 1) % learningTracks.length;
    changeTrack(nextIdx);
  }, [trackIndex, changeTrack]);

  const handlePrev = useCallback(() => {
    const prevIdx = (trackIndex - 1 + learningTracks.length) % learningTracks.length;
    changeTrack(prevIdx);
  }, [trackIndex, changeTrack]);

  // Timer tick interval effect
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setElapsed((prev) => {
        // Auto-advance each track in 15 seconds of real-time play.
        // Ticking every 100ms means 150 ticks total to complete the track.
        const increment = currentTrack.durationSeconds / 150;
        const nextElapsed = prev + increment;
        if (nextElapsed >= currentTrack.durationSeconds) {
          handleNext();
          return 0;
        }
        return nextElapsed;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isPlaying, currentTrack.durationSeconds, handleNext]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Click on timeline bar to seek coordinates
  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bg = progressBgRef.current;
    if (!bg) return;
    const rect = bg.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percent = Math.min(Math.max(clickX / width, 0), 1);
    setElapsed(Math.round(percent * currentTrack.durationSeconds));
  };

  // Scroll Trigger Entrance Animation
  useEffect(() => {
    const section = sectionRef.current;
    const player = playerRef.current;
    if (!section || !player) return;

    // Header animate
    const header = section.querySelector(".exploring-header");
    if (header) {
      gsap.fromTo(
        header,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: header,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Player card animate
    gsap.to(player, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: player,
        start: "top 88%",
        toggleActions: "play none none reverse",
      },
      onComplete: () => {
        player.classList.add("exploring-player-visible");
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger && section.contains(trigger.trigger as Node)) {
          trigger.kill();
        }
      });
    };
  }, []);

  const progressPercent = (elapsed / currentTrack.durationSeconds) * 100;

  return (
    <div
      className="exploring-section section-container"
      id="exploring"
      ref={sectionRef}
    >
      {/* Header */}
      <div className="exploring-header">
        <h2>
          <span className="exploring-title-exploring">Currently </span>
          <span className="exploring-title-radar">Exploring</span>
        </h2>
        <p className="exploring-subtitle">
          Ideas in active rotation.
          <br />
          Compact focus areas I keep returning to while building.
        </p>
      </div>

      <div className="exploring-player-wrapper" ref={playerRef}>
        <div className="exploring-player-card" ref={contentRef}>
          {/* Header Row: Label & Equalizer */}
          <div className="exploring-player-label-wrap">
            <div className="exploring-player-label">
              <span>🎧</span> Now Learning
            </div>
            
            {/* Pulsing Audio Equalizer */}
            <div className="exploring-equalizer">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`exploring-equalizer-bar ${
                    isPlaying ? "exploring-equalizer-bar--active" : ""
                  }`}
                />
              ))}
            </div>
          </div>

          <h3 className="exploring-track-title">
            <span>▶</span> {currentTrack.title}
          </h3>

          <p className="exploring-track-subtitle">{currentTrack.subtitle}</p>

          {/* Scrubber timeline progress slider */}
          <div className="exploring-timeline-container">
            <span className="exploring-timeline-time">{formatTime(elapsed)}</span>
            <div
              className="exploring-timeline-bar-bg"
              ref={progressBgRef}
              onClick={handleScrubberClick}
            >
              <div
                className="exploring-timeline-bar-progress"
                style={{ width: `${progressPercent}%` }}
              />
              <div
                className="exploring-timeline-dot"
                style={{ left: `${progressPercent}%` }}
              />
            </div>
            <span className="exploring-timeline-time">{currentTrack.duration}</span>
          </div>

          {/* Player controls */}
          <div className="exploring-player-controls">
            <button
              className="exploring-control-btn"
              onClick={handlePrev}
              type="button"
              aria-label="Previous Track"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <polygon points="19 20 9 12 19 4 19 20" />
                <line x1="5" y1="5" x2="5" y2="19" strokeWidth="2" stroke="currentColor" />
              </svg>
            </button>

            <button
              className="exploring-control-btn exploring-control-btn--play-pause"
              onClick={togglePlayPause}
              type="button"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>

            <button
              className="exploring-control-btn"
              onClick={handleNext}
              type="button"
              aria-label="Next Track"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <polygon points="5 4 15 12 5 20 5 4" />
                <line x1="19" y1="5" x2="19" y2="19" strokeWidth="2" stroke="currentColor" />
              </svg>
            </button>
          </div>

          {/* Details tags */}
          <div className="exploring-player-tags">
            {currentTrack.tags.map((tag) => (
              <span key={tag} className="exploring-player-tag">
                {tag}
              </span>
            ))}
          </div>

          <div className="exploring-player-accent" />
        </div>
      </div>
    </div>
  );
};

export default Exploring;
