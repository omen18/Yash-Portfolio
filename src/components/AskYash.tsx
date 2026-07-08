import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/AskYash.css";

gsap.registerPlugin(ScrollTrigger);

/* ─── Data ─── */

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
};

const topics: Record<TopicKey, TopicData> = {
  current_focus: {
    label: "Current Focus",
    command: "$ ask --topic current_focus",
    response:
      "I'm tightening the bridge between AI research and runnable systems: CogniSafe, interpretability probes, Kaggle baselines, and autonomous sensing concepts.",
  },
  why_ai: {
    label: "Why AI?",
    command: "$ ask --topic why_ai",
    response:
      "Because the most interesting problems live at the intersection of intelligence and systems. I want to build things that reason, adapt, and actually ship — not just benchmarks, but tools that change how people work.",
  },
  featured_build: {
    label: "Featured Build",
    command: "$ ask --topic featured_build",
    response:
      "CogniSafe — an AI-powered safety system combining real-time object detection, NLP-driven hazard analysis, and autonomous response. Built to prove that AI can be both fast and careful in critical environments.",
  },
  research_direction: {
    label: "Research Direction",
    command: "$ ask --topic research_direction",
    response:
      "Mechanistic interpretability: probing attention heads, tracking token flow through transformer layers, and building small tools that let you visualize what a model actually learns vs. what we assume it learns.",
  },
  exploring: {
    label: "What I'm Exploring",
    command: "$ ask --topic exploring",
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

/* ─── Component ─── */

const AskYash = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visibleLogs, setVisibleLogs] = useState<number>(0);
  const [activeTopic, setActiveTopic] = useState<TopicKey>("current_focus");
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showGlow, setShowGlow] = useState(false);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasAnimatedRef = useRef(false);

  // Stagger-reveal system logs when section scrolls into view
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      once: true,
      onEnter: () => {
        if (hasAnimatedRef.current) return;
        hasAnimatedRef.current = true;
        systemLogs.forEach((_, i) => {
          setTimeout(() => {
            setVisibleLogs((prev) => Math.max(prev, i + 1));
          }, i * 180);
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  // Typing effect for response text
  const typeText = useCallback((text: string) => {
    if (typingRef.current) clearTimeout(typingRef.current);
    setDisplayedText("");
    setIsTyping(true);
    setShowGlow(true);

    let index = 0;
    const type = () => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
        // Variable speed: faster for spaces, slightly random for natural feel
        const delay = text[index - 1] === " " ? 12 : 18 + Math.random() * 14;
        typingRef.current = setTimeout(type, delay);
      } else {
        setIsTyping(false);
        setTimeout(() => setShowGlow(false), 600);
      }
    };
    typingRef.current = setTimeout(type, 100);
  }, []);

  // Initial type on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      typeText(topics.current_focus.response);
    }, systemLogs.length * 180 + 400);

    return () => {
      clearTimeout(timer);
      if (typingRef.current) clearTimeout(typingRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTopicClick = (key: TopicKey) => {
    if (key === activeTopic && !isTyping) return;
    setActiveTopic(key);
    typeText(topics[key].response);
  };

  // GSAP entrance for the whole terminal block
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const terminal = section.querySelector(".askyash-terminal");
    const header = section.querySelector(".askyash-header");

    if (header) {
      gsap.fromTo(
        header,
        { opacity: 0, y: 30 },
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

    if (terminal) {
      gsap.fromTo(
        terminal,
        { opacity: 0, y: 50, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: terminal,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger && section.contains(t.trigger as Node)) {
          t.kill();
        }
      });
    };
  }, []);

  return (
    <div
      className="askyash-section section-container"
      id="askyash"
      ref={sectionRef}
    >
      {/* Header */}
      <div className="askyash-header">
        <p className="askyash-label">Interactive</p>
        <h2>
          <span className="askyash-title-ask">ASK </span>
          <span className="askyash-title-exe">YASH.EXE</span>
        </h2>
        <p className="askyash-desc">
          A terminal-style interface inspired by how I think about systems, AI,
          and building things.
        </p>
      </div>

      {/* Terminal */}
      <div className="askyash-terminal">
        {/* Title Bar */}
        <div className="askyash-titlebar">
          <span className="askyash-dot askyash-dot--red" />
          <span className="askyash-dot askyash-dot--yellow" />
          <span className="askyash-dot askyash-dot--green" />
          <span className="askyash-titlebar-text">yash.exe — zsh</span>
        </div>

        {/* Body */}
        <div className="askyash-body">
          {/* Left: System Logs */}
          <div className="askyash-logs">
            <p className="askyash-logs-title">System Logs</p>
            {systemLogs.map((log, i) => (
              <div
                key={log.id}
                className={`askyash-log-entry${
                  log.type ? ` askyash-log-entry--${log.type}` : ""
                }${i < visibleLogs ? " askyash-log-visible" : ""}`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <span className="askyash-log-num">[{log.id}]</span>
                <span className="askyash-log-text">
                  {log.text}
                  {i === systemLogs.length - 1 && i < visibleLogs && (
                    <span className="askyash-log-cursor" />
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* Right: Interactive */}
          <div className="askyash-interactive">
            <p className="askyash-interactive-title">Current Focus</p>

            {/* Topic Buttons */}
            <div className="askyash-topics">
              {topicKeys.map((key) => (
                <button
                  key={key}
                  className={`askyash-topic-btn${
                    activeTopic === key ? " askyash-topic-active" : ""
                  }`}
                  onClick={() => handleTopicClick(key)}
                  type="button"
                >
                  {topics[key].label}
                </button>
              ))}
            </div>

            {/* Response */}
            <div
              className={`askyash-response${
                showGlow ? " askyash-response-glow" : ""
              }`}
            >
              <p className="askyash-response-label">
                ask_ yash.exe response
              </p>
              <p className="askyash-response-text">
                {displayedText}
                {isTyping && <span className="askyash-typed-cursor" />}
              </p>

              {/* Prompt */}
              <div className="askyash-prompt">
                <span className="askyash-prompt-symbol">$</span>
                <span className="askyash-prompt-text">
                  {topics[activeTopic].command}
                </span>
                <span className="askyash-prompt-cursor" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskYash;
