import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/Exploring.css";

gsap.registerPlugin(ScrollTrigger);

// ─── 1. Lede Statement Data ───
const LEDE_LINES = [
  "Currently Exploring",
  "Ideas in active rotation and compact focus areas",
  "I keep returning to while building.",
];

// ─── 2. Topic Exploration Cards ───
export type TopicKey = "transformers" | "ai_agents" | "interpretability" | "autonomous_systems";

export interface TopicItem {
  id: TopicKey;
  label: string;
  badge: string;
  question: string;
  content: string;
}

const topics: Record<TopicKey, TopicItem> = {
  transformers: {
    id: "transformers",
    label: "Transformers",
    badge: "Architecture & Latents",
    question: "What I'm currently exploring in Transformers",
    content:
      "Probing attention head dynamics, residual streams, and latent representation geometry. Exploring mechanistic layer dynamics, KV cache optimizations, and multimodal context compression to build models that process information with higher semantic density.",
  },
  ai_agents: {
    id: "ai_agents",
    label: "AI Agents",
    badge: "Cognitive Loops",
    question: "How I'm approaching AI Agents",
    content:
      "Architecting goal-driven autonomous workflows, tool-augmented reasoning loops, and multi-agent consensus protocols. Moving beyond simple prompts into self-correcting cognitive loops that plan, verify, and execute complex real-world tasks.",
  },
  interpretability: {
    id: "interpretability",
    label: "Interpretability",
    badge: "Mechanistic Probes",
    question: "My focus in Interpretability",
    content:
      "Mechanistic interpretability probes and activation patching. Mapping how internal neural circuits form world models and circuit-level reasoning paths, turning black-box neural networks into transparent, auditable decision engines.",
  },
  autonomous_systems: {
    id: "autonomous_systems",
    label: "Autonomous Systems",
    badge: "Perception & Action",
    question: "What excites me about Autonomous Systems",
    content:
      "Fusing perception, temporal planning, and edge inference into closed-loop physical systems. Exploring end-to-end sensor fusion, real-time spatial representations, and lightweight vision-language-action policies that adapt to uncertain physical environments.",
  },
};

const topicKeys: TopicKey[] = [
  "transformers",
  "ai_agents",
  "interpretability",
  "autonomous_systems",
];

const Exploring = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const ledeRef = useRef<HTMLDivElement>(null);
  const cardSectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const demoCursorRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const [activeTopic, setActiveTopic] = useState<TopicKey>("transformers");
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const currentIndexRef = useRef<number>(0);
  const isGlidingRef = useRef<boolean>(false);
  const hasStartedRef = useRef<boolean>(false);

  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoTourTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moveToNextTopicRef = useRef<() => void>(() => {});

  // ─── 3. Scroll-Triggered Lede Character Scrub Animation ───
  useEffect(() => {
    const ledeEl = ledeRef.current;
    const cardSection = cardSectionRef.current;
    if (!ledeEl || !cardSection) return;

    const chars = ledeEl.querySelectorAll<HTMLSpanElement>(".sasha-char");
    if (!chars.length) return;

    const ctx = gsap.context(() => {
      // Pin lede section for smooth scrub illumination
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ledeEl,
          start: "top top",
          end: "+=1200",
          pin: true,
          pinSpacing: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        chars,
        {
          opacity: 0.14,
          color: "rgba(255, 255, 255, 0.14)",
          y: "0.08em",
          textShadow: "0 0 0px rgba(255, 255, 255, 0)",
        },
        {
          opacity: 1,
          color: "#ffffff",
          y: "0em",
          textShadow: "0 0 24px rgba(255, 255, 255, 0.65)",
          stagger: {
            each: 0.025,
            ease: "linear",
          },
          ease: "none",
          duration: 0.85,
        }
      ).to(ledeEl, {
        opacity: 0.95,
        duration: 0.15,
      });

      // Smooth entrance of the interactive card section
      gsap.fromTo(
        cardSection,
        {
          opacity: 0,
          y: 60,
          scale: 0.97,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardSection,
            start: "top 80%",
            end: "top 35%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    });

    return () => {
      ctx.revert();
    };
  }, []);

  // ─── 4. Typewriter Content Streaming ───
  const typeText = useCallback((targetText: string, onComplete?: () => void) => {
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    setIsTyping(true);
    setDisplayedText("");

    let currentLength = 0;
    const speedMs = 14;

    const stream = () => {
      currentLength++;
      setDisplayedText(targetText.slice(0, currentLength));

      if (currentLength < targetText.length) {
        typingTimerRef.current = setTimeout(stream, speedMs);
      } else {
        setIsTyping(false);
        if (onComplete) onComplete();
      }
    };

    typingTimerRef.current = setTimeout(stream, 40);
  }, []);

  // ─── 5. Automated Tour with Exactly 3-Second Pause After Completion ───
  const scheduleNextTopic = useCallback(() => {
    if (autoTourTimerRef.current) clearTimeout(autoTourTimerRef.current);

    // EXACT USER SPECIFICATION: change after 3 sec of completing one content item
    autoTourTimerRef.current = setTimeout(() => {
      moveToNextTopicRef.current();
    }, 3000);
  }, []);

  const moveToNextTopic = useCallback(() => {
    const cursor = demoCursorRef.current;
    const card = cardRef.current;
    if (!cursor || !card) return;

    if (isGlidingRef.current) return;
    isGlidingRef.current = true;

    // Clear any pending timers
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    if (autoTourTimerRef.current) clearTimeout(autoTourTimerRef.current);

    // Cancel existing cursor tweens
    gsap.killTweensOf(cursor);

    // Advance to the NEXT topic in sequential order:
    // 0: Transformers -> 1: AI Agents -> 2: Interpretability -> 3: Autonomous Systems -> 0: Transformers
    currentIndexRef.current = (currentIndexRef.current + 1) % topicKeys.length;
    const nextKey = topicKeys[currentIndexRef.current];
    const targetPill = pillRefs.current[nextKey];

    if (!targetPill) {
      isGlidingRef.current = false;
      return;
    }

    const cardRect = card.getBoundingClientRect();
    const pillRect = targetPill.getBoundingClientRect();

    const targetX = pillRect.left - cardRect.left + pillRect.width / 2 - 6;
    const targetY = pillRect.top - cardRect.top + pillRect.height / 2 - 4;

    // Glide automated cursor smoothly to the target pill
    gsap.to(cursor, {
      opacity: 1,
      x: targetX,
      y: targetY,
      duration: 0.65,
      ease: "power2.inOut",
      onComplete: () => {
        // Click effect with ripple
        const ripple = cursor.querySelector(".exploring-cursor-ripple");
        if (ripple) {
          gsap.fromTo(
            ripple,
            { scale: 0.3, opacity: 0.9 },
            { scale: 2.4, opacity: 0, duration: 0.45, ease: "power2.out" }
          );
        }

        gsap.timeline()
          .to(cursor, { scale: 0.8, duration: 0.1, ease: "power1.in" })
          .call(() => {
            // Activate next topic in state
            setActiveTopic(nextKey);
          })
          .to(cursor, { scale: 1, duration: 0.12 })
          .call(() => {
            isGlidingRef.current = false;
            // Stream the text for this topic, then wait 3s after completing before next
            typeText(topics[nextKey].content, () => {
              scheduleNextTopic();
            });
          });
      },
    });
  }, [typeText, scheduleNextTopic]);

  useEffect(() => {
    moveToNextTopicRef.current = moveToNextTopic;
  }, [moveToNextTopic]);

  // Handle manual pill click
  const handlePillClick = useCallback(
    (key: TopicKey) => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      if (autoTourTimerRef.current) clearTimeout(autoTourTimerRef.current);

      const cursor = demoCursorRef.current;
      if (cursor) gsap.killTweensOf(cursor);
      isGlidingRef.current = false;

      // Sync index to clicked pill
      currentIndexRef.current = topicKeys.indexOf(key);
      setActiveTopic(key);

      const card = cardRef.current;
      const targetPill = pillRefs.current[key];

      if (cursor && card && targetPill) {
        const cardRect = card.getBoundingClientRect();
        const pillRect = targetPill.getBoundingClientRect();
        const targetX = pillRect.left - cardRect.left + pillRect.width / 2 - 6;
        const targetY = pillRect.top - cardRect.top + pillRect.height / 2 - 4;

        gsap.to(cursor, {
          opacity: 1,
          x: targetX,
          y: targetY,
          duration: 0.4,
          ease: "power2.out",
        });
      }

      typeText(topics[key].content, () => {
        scheduleNextTopic();
      });
    },
    [typeText, scheduleNextTopic]
  );

  // Initialize first topic and start automated tour when scrolled into view
  useEffect(() => {
    const cardEl = cardSectionRef.current;
    if (!cardEl) return;

    const trigger = ScrollTrigger.create({
      trigger: cardEl,
      start: "top 75%",
      once: true,
      onEnter: () => {
        if (hasStartedRef.current) return;
        hasStartedRef.current = true;

        currentIndexRef.current = 0;
        const firstKey = topicKeys[0]; // "transformers"
        setActiveTopic(firstKey);

        // Position cursor initially on the first pill
        const card = cardRef.current;
        const firstPill = pillRefs.current[firstKey];
        const cursor = demoCursorRef.current;
        if (card && firstPill && cursor) {
          const cardRect = card.getBoundingClientRect();
          const pillRect = firstPill.getBoundingClientRect();
          gsap.set(cursor, {
            x: pillRect.left - cardRect.left + pillRect.width / 2 - 6,
            y: pillRect.top - cardRect.top + pillRect.height / 2 - 4,
            opacity: 1,
          });
        }

        typeText(topics[firstKey].content, () => {
          scheduleNextTopic();
        });
      },
    });

    return () => {
      trigger.kill();
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      if (autoTourTimerRef.current) clearTimeout(autoTourTimerRef.current);
      if (demoCursorRef.current) gsap.killTweensOf(demoCursorRef.current);
    };
  }, [typeText, scheduleNextTopic]);

  const currentTopicData = topics[activeTopic];

  return (
    <div className="sasha-exploring-wrapper" ref={sectionRef} id="exploring">
      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: Lede Section with GSAP Character Reveal Scrub
          ───────────────────────────────────────────────────────────── */}
      <section className="sasha-lede-section" ref={ledeRef}>
        <div className="sasha-lede-container">
          <h2 className="sasha-lede-statement">
            {LEDE_LINES.map((line, lIdx) => (
              <span key={lIdx} className="sasha-lede-line">
                {line.split(" ").map((word, wIdx, arr) => (
                  <span key={wIdx} className="sasha-lede-word">
                    {word.split("").map((char, cIdx) => (
                      <span key={cIdx} className="sasha-char">
                        {char}
                      </span>
                    ))}
                    {wIdx < arr.length - 1 && <span className="sasha-space">&nbsp;</span>}
                  </span>
                ))}
              </span>
            ))}
          </h2>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: Interactive Exploring Card
          ───────────────────────────────────────────────────────────── */}
      <section className="exploring-card-section" ref={cardSectionRef}>
        {/* Floating Dark Glassmorphic Card */}
        <div className="exploring-chat-card" ref={cardRef}>
          {/* Automated Demo Cursor with Aesthetic Yellow Accent & Click Ripple */}
          <div className="exploring-demo-cursor" ref={demoCursorRef} aria-hidden="true">
            <span className="exploring-cursor-ripple" />
            <svg
              className="exploring-cursor-svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                d="M9 2.8c0-1 .8-1.8 1.8-1.8s1.8.8 1.8 1.8v6.4l4.9 1.2c1.2.3 2 1.4 1.9 2.6l-.5 5.3a3.4 3.4 0 0 1-3.4 3.1h-4.7c-1 0-2-.5-2.7-1.3l-4-4.8c-.6-.7-.5-1.7.2-2.3.7-.6 1.7-.5 2.3.1L9 16.2V2.8z"
                fill="#eee642"
                stroke="#000000"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Card Top: Topic Question Placeholder */}
          <div className="exploring-card-top">
            <div className="exploring-topic-badge">
              <span className="badge-pulse-dot" />
              <span>{currentTopicData.badge}</span>
            </div>
            <h4 className="exploring-topic-question">{currentTopicData.question}</h4>
          </div>

          {/* Card Middle: Streaming Response Text */}
          <div className="exploring-content-area">
            <p className="exploring-stream-paragraph">
              {displayedText}
              {isTyping && <span className="exploring-typing-caret">|</span>}
            </p>
          </div>

          {/* Card Bottom: Quick Topic Pills Row */}
          <div className="exploring-pills-row">
            {topicKeys.map((key) => {
              const isActive = activeTopic === key;
              return (
                <button
                  key={key}
                  ref={(el) => (pillRefs.current[key] = el)}
                  className={`exploring-topic-pill ${isActive ? "is-active" : ""}`}
                  onClick={() => handlePillClick(key)}
                  type="button"
                >
                  {topics[key].label}
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Exploring;
