import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaTerminal, FaCode, FaMicrochip, FaBolt, FaShareNodes, FaArrowRight } from "react-icons/fa6";
import { BsHeart, BsChatDots, BsBookmark } from "react-icons/bs";
import "./styles/AskYash.css";

gsap.registerPlugin(ScrollTrigger);

/* ─── Original Data ─── */

type LogEntry = {
  id: string;
  text: string;
  type?: "warning" | "success" | "info";
};

const systemLogs: LogEntry[] = [
  { id: "01", text: "booting yash.exe" },
  { id: "02", text: "loading transformer interpretability modules", type: "info" },
  { id: "03", text: "syncing Kaggle experiment shelf" },
  { id: "04", text: "calibrating autonomous sensing concepts" },
  { id: "05", text: "warning: overengineering tendency detected", type: "warning" },
  { id: "06", text: "gym.exe running in background" },
  { id: "07", text: "ready for recruiter input", type: "success" },
  { id: "08", text: "listener online_", type: "success" },
];

type TopicKey =
  | "current_focus"
  | "why_ai"
  | "featured_build"
  | "research_direction"
  | "exploring";

type TopicData = {
  label: string;
  command: string;
  response: string;
  badge?: string;
};

const topics: Record<TopicKey, TopicData> = {
  current_focus: {
    label: "Current Focus",
    command: "$ ask --topic current_focus",
    badge: "Active Sprint",
    response:
      "I'm tightening the bridge between AI research and runnable systems: CutisAI, interpretability probes, Kaggle baselines, and autonomous sensing concepts.",
  },
  why_ai: {
    label: "Why AI?",
    command: "$ ask --topic why_ai",
    badge: "Philosophy",
    response:
      "Because the most interesting problems live at the intersection of intelligence and systems. I want to build things that reason, adapt, and actually ship — not just benchmarks, but tools that change how people work.",
  },
  featured_build: {
    label: "Featured Build",
    command: "$ ask --topic featured_build",
    badge: "CutisAI",
    response:
      "CutisAI — an AI-powered clinical intelligence system combining real-time dermatological analysis, diagnostic triaging, and multimodal medical imaging models. Built to deliver precise, accessible healthcare insights.",
  },
  research_direction: {
    label: "Research Direction",
    command: "$ ask --topic research_direction",
    badge: "Mechanistic",
    response:
      "Mechanistic interpretability: probing attention heads, tracking token flow through transformer layers, and building small tools that let you visualize what a model actually learns vs. what we assume it learns.",
  },
  exploring: {
    label: "What I'm Exploring",
    command: "$ ask --topic exploring",
    badge: "R&D",
    response:
      "Transformer internals, tool-using AI agents, interpretability experiments, and autonomous perception systems. I keep rotating between these — each one feeds the others in unexpected ways.",
  },
};

const topicKeys: TopicKey[] = [
  "current_focus",
  "why_ai",
  "featured_build",
  "research_direction",
  "exploring",
];

const AskYash = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const whiteCardRef = useRef<HTMLDivElement>(null);
  const previewsRef = useRef<HTMLDivElement>(null);
  const demoCursorRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const pillRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const [visibleLogs, setVisibleLogs] = useState<number>(0);
  const [activeTopic, setActiveTopic] = useState<TopicKey>("current_focus");
  const activeTopicRef = useRef<TopicKey>(activeTopic);

  const [cursorType, setCursorType] = useState<"pointer" | "text">("pointer");
  const [isWritingFocused, setIsWritingFocused] = useState(false);

  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showGlow, setShowGlow] = useState(false);
  const [activeLogIndex, setActiveLogIndex] = useState(2);

  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoTourTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep activeTopicRef in sync
  useEffect(() => {
    activeTopicRef.current = activeTopic;
  }, [activeTopic]);

  // Stagger-reveal system logs when section scrolls into view
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      once: true,
      onEnter: () => {
        systemLogs.forEach((_, i) => {
          setTimeout(() => {
            setVisibleLogs((prev) => Math.max(prev, i + 1));
          }, i * 140);
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const moveToNextTopicRef = useRef<() => void>(() => {});

  // Typing effect for response text
  const typeText = useCallback((text: string) => {
    if (typingRef.current) clearTimeout(typingRef.current);
    if (autoTourTimerRef.current) clearTimeout(autoTourTimerRef.current);

    setDisplayedText("");
    setIsTyping(true);
    setShowGlow(true);

    let index = 0;
    const type = () => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
        const delay = text[index - 1] === " " ? 10 : 16 + Math.random() * 12;
        typingRef.current = setTimeout(type, delay);
      } else {
        setIsTyping(false);
        setTimeout(() => setShowGlow(false), 350);

        // ─── Trigger auto-cursor precisely 2.2 seconds after lines complete ───
        autoTourTimerRef.current = setTimeout(() => {
          moveToNextTopicRef.current();
        }, 2200);
      }
    };
    typingRef.current = setTimeout(type, 80);
  }, []);

  // Helper to calculate pixel-perfect coordinates for the start of the writing paragraph
  const getWritingStartCoords = useCallback(() => {
    const card = whiteCardRef.current;
    const para = paragraphRef.current;
    if (!card || !para) return null;

    const cardRect = card.getBoundingClientRect();
    const paraRect = para.getBoundingClientRect();

    // The cursor container is 32x32 with the I-beam bar centered at (16, 16).
    // Aligning the I-beam bar directly to the start of the paragraph's first character:
    const targetX = Math.round(paraRect.left - cardRect.left - 15);
    const targetY = Math.round(paraRect.top - cardRect.top - 2);

    return { targetX, targetY };
  }, []);

  // Automated cursor sequence:
  // 1. Cursor in pointer mode glides to next topic pill & clicks it
  // 2. Cursor transforms into yellow I-beam text cursor
  // 3. Cursor glides directly to the exact start of the writing paragraph
  // 4. Clicks right where the first letter will be typed
  // 5. Content of that topic streams in directly from that click point
  const moveToNextTopic = useCallback(() => {
    const cursor = demoCursorRef.current;
    const card = whiteCardRef.current;
    if (!cursor || !card) return;

    const currentKey = activeTopicRef.current;
    const nextIndex = (topicKeys.indexOf(currentKey) + 1) % topicKeys.length;
    const nextKey = topicKeys[nextIndex];
    const targetPill = pillRefs.current[nextKey];

    if (!targetPill) return;

    const cardRect = card.getBoundingClientRect();
    const pillRect = targetPill.getBoundingClientRect();

    const pillX = pillRect.left - cardRect.left + pillRect.width / 2 - 4;
    const pillY = pillRect.top - cardRect.top + pillRect.height / 2 - 2;

    // Step 1: Switch to pointer hand & glide to the topic pill button
    setCursorType("pointer");
    setIsWritingFocused(false);

    gsap.to(cursor, {
      opacity: 1,
      x: pillX,
      y: pillY,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        // Step 2: Click the pill
        const ripple = cursor.querySelector(".okay-cursor-ripple");
        gsap.timeline()
          .to(cursor, { scale: 0.8, duration: 0.1, ease: "power1.in" })
          .call(() => {
            if (ripple) {
              gsap.fromTo(
                ripple,
                { scale: 0.3, opacity: 0.9 },
                { scale: 2.2, opacity: 0, duration: 0.4, ease: "power2.out" }
              );
            }
            // Switch topic state & clear text box so writing area is ready
            setActiveTopic(nextKey);
            setDisplayedText("");
            const newLogIdx = (topicKeys.indexOf(nextKey) * 2) % systemLogs.length;
            setActiveLogIndex(newLogIdx);
          })
          .to(cursor, { scale: 1, duration: 0.12 })
          .call(() => {
            // Step 3: Switch cursor to yellow text I-beam ("yellow writing thing")
            setCursorType("text");

            // Step 4: Glide down directly to the exact start of the writing paragraph
            const coords = getWritingStartCoords();
            if (!coords) return;

            gsap.to(cursor, {
              opacity: 1,
              x: coords.targetX,
              y: coords.targetY,
              duration: 0.5,
              ease: "power2.inOut",
              onComplete: () => {
                // Step 5: Click at the exact start of the writing paragraph
                gsap.timeline()
                  .to(cursor, { scale: 0.84, duration: 0.09 })
                  .call(() => {
                    setIsWritingFocused(true);
                    if (ripple) {
                      gsap.fromTo(
                        ripple,
                        { scale: 0.2, opacity: 0.8 },
                        { scale: 1.8, opacity: 0, duration: 0.35 }
                      );
                    }
                    // Step 6: Content starts writing directly from that click point!
                    typeText(topics[nextKey].response);
                  })
                  .to(cursor, { scale: 1, duration: 0.12 });
              },
            });
          });
      },
    });
  }, [typeText, getWritingStartCoords]);

  useEffect(() => {
    moveToNextTopicRef.current = moveToNextTopic;
  }, [moveToNextTopic]);

  // Handle manual topic click
  const handleTopicClick = useCallback(
    (key: TopicKey) => {
      if (typingRef.current) clearTimeout(typingRef.current);
      if (autoTourTimerRef.current) clearTimeout(autoTourTimerRef.current);

      setActiveTopic(key);
      setDisplayedText("");
      const newLogIdx = (topicKeys.indexOf(key) * 2) % systemLogs.length;
      setActiveLogIndex(newLogIdx);

      // Glide cursor directly to the writing start position with text glyph and write
      setCursorType("text");
      const cursor = demoCursorRef.current;
      const coords = getWritingStartCoords();

      if (cursor && coords) {
        gsap.to(cursor, {
          opacity: 1,
          x: coords.targetX,
          y: coords.targetY,
          duration: 0.4,
          ease: "power2.inOut",
          onComplete: () => {
            setIsWritingFocused(true);
            typeText(topics[key].response);
          },
        });
      } else {
        typeText(topics[key].response);
      }
    },
    [typeText, getWritingStartCoords]
  );

  // Initial mount: position cursor at exact start of paragraph & trigger first topic writing
  useEffect(() => {
    const initTimer = setTimeout(() => {
      const cursor = demoCursorRef.current;
      const coords = getWritingStartCoords();

      if (cursor && coords) {
        setCursorType("text");
        setIsWritingFocused(true);
        gsap.set(cursor, { x: coords.targetX, y: coords.targetY, opacity: 1 });
      }

      typeText(topics.current_focus.response);
    }, 500);

    return () => {
      clearTimeout(initTimer);
      if (typingRef.current) clearTimeout(typingRef.current);
      if (autoTourTimerRef.current) clearTimeout(autoTourTimerRef.current);
    };
  }, [typeText, getWritingStartCoords]);

  // GSAP Entrance Transition & Scroll-Driven Scrub Animation
  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const watermark = watermarkRef.current;
    const leftCol = leftColRef.current;
    const whiteCard = whiteCardRef.current;
    const previews = previewsRef.current;

    if (!section || !container) return;

    const ctx = gsap.context(() => {
      // 1. Entrance animation when scrolling down to yash.exe
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });

      entranceTl
        .fromTo(
          container,
          { opacity: 0, y: 70, scale: 0.94, borderRadius: 52 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            borderRadius: 32,
            duration: 1.1,
            ease: "power3.out",
          }
        )
        .fromTo(
          leftCol?.querySelectorAll(".okay-hero-title, .okay-badge-row, .okay-hero-desc, .okay-hero-subline") || [],
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power2.out" },
          "-=0.7"
        )
        .fromTo(
          leftCol?.querySelectorAll(".okay-log-item") || [],
          { opacity: 0, x: -25 },
          { opacity: 1, x: 0, duration: 0.5, stagger: 0.04, ease: "power2.out" },
          "-=0.5"
        )
        .fromTo(
          whiteCard,
          { opacity: 0, y: 50, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.2)" },
          "-=0.6"
        )
        .fromTo(
          previews?.children || [],
          { opacity: 0, y: 40, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" },
          "-=0.4"
        );

      // 2. Scroll Scrubbing: Parallax movement of "YASH.EXE" watermark as you scroll down and up
      if (watermark) {
        gsap.fromTo(
          watermark,
          { xPercent: 18 },
          {
            xPercent: -35,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      }

      // 3. Scroll Scrubbing: Gentle vertical parallax of floating preview cards
      if (previews) {
        gsap.fromTo(
          previews,
          { y: 35 },
          {
            y: -35,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          }
        );
      }

      // 4. Subtle floating tilt of the preview cards on scroll
      const previewCards = previews?.querySelectorAll(".okay-preview-card");
      if (previewCards && previewCards.length >= 2) {
        gsap.to(previewCards[0], {
          rotation: -3,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        });
        gsap.to(previewCards[1], {
          rotation: 3,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        });
        if (previewCards[2]) {
          gsap.to(previewCards[2], {
            rotation: -1.5,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 2,
            },
          });
        }
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="askyash-okay-section" id="askyash" ref={sectionRef}>
      <div className="okay-banner-container" ref={containerRef}>
        {/* Parallax Moving Watermark like in https://okaydev.co/ */}
        <div className="okay-watermark" ref={watermarkRef} aria-hidden="true">
          YASH.EXE
        </div>

        <div className="okay-banner-grid">
          {/* ─── LEFT COLUMN: Bold Typography & Numbered Items ─── */}
          <div className="okay-left-col" ref={leftColRef}>
            <div className="okay-badge-row">
              <span className="okay-tag-label">INTERACTIVE</span>
              <span className="okay-tag-dot">•</span>
              <span className="okay-tag-status">v2.4 online</span>
            </div>

            <h2 className="okay-hero-title">
              ASK <br />
              <span className="okay-hero-highlight">YASH.EXE</span>
            </h2>

            <p className="okay-hero-desc">
              A terminal-style interface inspired by how I think about systems, AI,
              and building things.
            </p>

            <p className="okay-hero-subline">
              No ads. No ranking. Real runnable systems.
            </p>

            {/* Numbered System Logs in okaydev.co signature list style */}
            <div className="okay-numbered-logs">
              {systemLogs.map((log, i) => {
                const isActive = i === activeLogIndex;
                const isVisible = i < visibleLogs || visibleLogs === 0;

                return (
                  <div
                    key={log.id}
                    onClick={() => setActiveLogIndex(i)}
                    className={`okay-log-item ${isActive ? "okay-log-item--active" : ""} ${
                      isVisible ? "okay-log-item--visible" : ""
                    } ${log.type ? `okay-log-item--${log.type}` : ""}`}
                  >
                    <span className="okay-log-num">{log.id}</span>
                    <span className="okay-log-text">
                      {log.text}
                      {i === systemLogs.length - 1 && (
                        <span className="okay-cursor-blink">_</span>
                      )}
                    </span>

                    {isActive && (
                      <span className="okay-active-pill" title="Active log state">
                        <span className="okay-pulse-ring" />
                        <span className="okay-pulse-dot" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* CTA Button — Bold Yellow Pill like okaydev.co */}
            <div className="okay-cta-wrap">
              <button
                className="okay-yellow-btn"
                onClick={() => {
                  const nextIndex = (topicKeys.indexOf(activeTopic) + 1) % topicKeys.length;
                  handleTopicClick(topicKeys[nextIndex]);
                }}
              >
                <span>NEXT TOPIC ({topics[activeTopic].label})</span>
                <FaArrowRight className="okay-btn-arrow" />
              </button>
            </div>
          </div>

          {/* ─── RIGHT COLUMN: Floating White Composer Card + Feed Previews ─── */}
          <div className="okay-right-col">
            <div className="okay-track-meta">
              <span className="okay-track-meta-num">
                0{topicKeys.indexOf(activeTopic) + 1}
              </span>
              <span className="okay-track-meta-sep">·</span>
              <span className="okay-track-meta-label">
                ask_ yash.exe response
              </span>
            </div>

            {/* Floating White Card */}
            <div
              className={`okay-white-card ${showGlow ? "okay-card-glow" : ""}`}
              ref={whiteCardRef}
            >
              {/* Automated Demo Cursor with Dynamic Glyph Switch */}
              <div
                className={`okay-demo-cursor ${
                  cursorType === "text" ? "okay-demo-cursor--text" : ""
                }`}
                ref={demoCursorRef}
                aria-hidden="true"
              >
                <span className="okay-cursor-ripple" />

                {cursorType === "pointer" ? (
                  /* Pointer Hand Glyph */
                  <svg
                    className="okay-cursor-svg okay-cursor-svg--pointer"
                    viewBox="0 0 24 24"
                    width="26"
                    height="26"
                  >
                    <path
                      d="M9 2.8c0-1 .8-1.8 1.8-1.8s1.8.8 1.8 1.8v6.4l4.9 1.2c1.2.3 2 1.4 1.9 2.6l-.5 5.3a3.4 3.4 0 0 1-3.4 3.1h-4.7c-1 0-2-.5-2.7-1.3l-4-4.8c-.6-.7-.5-1.7.2-2.3.7-.6 1.7-.5 2.3.1L9 16.2V2.8z"
                      fill="#eee642"
                      stroke="#0c0c0c"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  /* Yellow Writing I-Beam Glyph (Signature OkayDev Text Cursor) */
                  <svg
                    className="okay-cursor-svg okay-cursor-svg--text"
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                  >
                    <path d="M8 2h3v20H8M13 2h3v20h-3M9.5 4v16h1.8V4z" fill="none" />
                    <path
                      d="M8 2.5c1.6 0 3 .4 4 1.4 1-1 2.4-1.4 4-1.4M8 21.5c1.6 0 3-.4 4-1.4 1 1 2.4 1.4 4 1.4M12 3.9v16.2"
                      fill="none"
                      stroke="#0c0c0c"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8 2.5c1.6 0 3 .4 4 1.4 1-1 2.4-1.4 4-1.4M8 21.5c1.6 0 3-.4 4-1.4 1 1 2.4 1.4 4 1.4M12 3.9v16.2"
                      fill="none"
                      stroke="#eee642"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </div>

              {/* Card Header / Topic Pills */}
              <div className="okay-card-header">
                <div className="okay-card-window-dots">
                  <span className="okay-dot okay-dot--red" />
                  <span className="okay-dot okay-dot--yellow" />
                  <span className="okay-dot okay-dot--green" />
                  <span className="okay-card-window-title">yash.exe — zsh</span>
                </div>

                <div className="okay-topics-pills">
                  {topicKeys.map((key) => (
                    <button
                      key={key}
                      ref={(el) => (pillRefs.current[key] = el)}
                      className={`okay-topic-pill ${
                        activeTopic === key ? "okay-topic-pill--active" : ""
                      }`}
                      onClick={() => handleTopicClick(key)}
                      type="button"
                    >
                      {topics[key].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Body: Dynamic Response Text / Writing Area */}
              <div
                className={`okay-card-body ${isWritingFocused ? "okay-writing-focused" : ""}`}
              >
                <div className="okay-prompt-command-line">
                  <span className="okay-prompt-symbol">&gt;</span>
                  <span className="okay-prompt-cmd-text">
                    {topics[activeTopic].command}
                  </span>
                </div>

                {/* The exact paragraph where writing begins */}
                <div className="okay-response-output">
                  <p className="okay-response-paragraph" ref={paragraphRef}>
                    {displayedText}
                    {isTyping && <span className="okay-typing-caret" />}
                  </p>
                </div>
              </div>

              {/* Card Footer: Composer Actions Toolbar */}
              <div className="okay-card-footer">
                <div className="okay-card-icons">
                  <button className="okay-tool-icon" title="Terminal" type="button">
                    <FaTerminal />
                  </button>
                  <button className="okay-tool-icon" title="Code" type="button">
                    <FaCode />
                  </button>
                  <button className="okay-tool-icon" title="Hardware/Model" type="button">
                    <FaMicrochip />
                  </button>
                  <button className="okay-tool-icon" title="Fast Inference" type="button">
                    <FaBolt />
                  </button>
                  <span className="okay-tool-divider" />
                  <button className="okay-tool-icon" title="Share" type="button">
                    <FaShareNodes />
                  </button>
                </div>

                <div className="okay-card-actions-right">
                  <div className="okay-char-counter" title="Response token count">
                    <span>{displayedText.length}</span>
                  </div>

                  <button
                    className="okay-post-btn"
                    onClick={() => {
                      typeText(topics[activeTopic].response);
                    }}
                    type="button"
                  >
                    RE-RUN
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Mini Social Feed Cards (matching okaydev.co's floating cards in Photo 2) */}
            <div className="okay-floating-previews" ref={previewsRef}>
              {/* Card 1: CutisAI */}
              <div
                className="okay-preview-card okay-preview-card--1"
                onClick={() => handleTopicClick("featured_build")}
              >
                <div className="okay-preview-card-top">
                  <div className="okay-preview-avatar">CA</div>
                  <div className="okay-preview-meta">
                    <h5>CutisAI</h5>
                    <span>Clinical Intelligence · Diagnostic Vision</span>
                  </div>
                </div>
                <div className="okay-preview-thumb okay-preview-thumb--cutisai">
                  <div className="okay-thumb-overlay">
                    <span className="okay-thumb-tag">0.98 AUC</span>
                    <span className="okay-thumb-fps">Realtime</span>
                  </div>
                </div>
                <div className="okay-preview-actions">
                  <span><BsHeart /> 48</span>
                  <span><BsChatDots /> 12</span>
                  <span><BsBookmark /></span>
                </div>
              </div>

              {/* Card 2: opsz / Probes */}
              <div
                className="okay-preview-card okay-preview-card--2"
                onClick={() => handleTopicClick("research_direction")}
              >
                <div className="okay-preview-card-top">
                  <div className="okay-preview-avatar okay-preview-avatar--purple">IP</div>
                  <div className="okay-preview-meta">
                    <h5>Interpretability Probes</h5>
                    <span>Transformer Heads · Activation Flow</span>
                  </div>
                </div>
                <div className="okay-preview-thumb okay-preview-thumb--opsz">
                  <span className="okay-opsz-text">opsz</span>
                  <code>@attention_head[11, 4]</code>
                </div>
                <div className="okay-preview-actions">
                  <span><BsHeart /> 64</span>
                  <span><BsChatDots /> 19</span>
                  <span><BsBookmark /></span>
                </div>
              </div>

              {/* Card 3: Kaggle Shelf */}
              <div
                className="okay-preview-card okay-preview-card--3"
                onClick={() => handleTopicClick("exploring")}
              >
                <div className="okay-preview-card-top">
                  <div className="okay-preview-avatar okay-preview-avatar--yellow">KG</div>
                  <div className="okay-preview-meta">
                    <h5>Kaggle Shelf</h5>
                    <span>Benchmark baselines &amp; rankers</span>
                  </div>
                </div>
                <div className="okay-preview-thumb okay-preview-thumb--kaggle">
                  <div className="okay-kaggle-stat">Top 5% Solutions</div>
                  <div className="okay-kaggle-tags">
                    <span>PyTorch</span>
                    <span>DeBERTa</span>
                    <span>Ensemble</span>
                  </div>
                </div>
                <div className="okay-preview-actions">
                  <span><BsHeart /> 35</span>
                  <span><BsChatDots /> 8</span>
                  <span><BsBookmark /></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AskYash;
