import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/ResearchLab.css";

gsap.registerPlugin(ScrollTrigger);

/* ─── Data ─── */

type Experiment = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: "published" | "soon";
  icon: "lane" | "coming";
  actionLabel?: string;
  actionUrl?: string;
};

const experiments: Experiment[] = [
  {
    id: "EXP-001",
    icon: "lane",
    title: "Curve and Lane Detection using Image Processing Techniques",
    description:
      "Exploring edge detection, Hough transforms, and polynomial curve fitting to detect lane boundaries in real-time driving footage. A foundational experiment bridging classical CV and autonomous perception.",
    tags: ["OpenCV", "Edge Detection", "Hough Transform", "Image Processing", "Autonomous"],
    status: "published",
    actionLabel: "View Notes (PDF)",
    actionUrl:
      "https://drive.google.com/file/d/1N52vWAHjnClyh-aapYvV5_LD1psnNXCK/view?usp=sharing",
  },
  {
    id: "EXP-002",
    icon: "coming",
    title: "More Experiments Coming Soon",
    description:
      "Interpretability probes, Kaggle baselines, sensing network concepts, and model debugging notebooks — all in active development.",
    tags: ["Interpretability", "Kaggle", "Model Probes", "Sensing"],
    status: "soon",
  },
];

/* ─── SVG Icons ─── */

const icons: Record<string, JSX.Element> = {
  lane: (
    <svg viewBox="0 0 24 24">
      <path d="M12 2v20" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
      <path d="M4 4l4 4" />
      <path d="M16 16l4 4" />
      <path d="M4 20l4-4" />
      <path d="M16 8l4-4" />
    </svg>
  ),
  coming: (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
};

/* ─── Component ─── */

const ResearchLab = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const glowRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    downloadUrl: string;
    viewUrl: string;
  } | null>(null);

  const handleActionClick = (e: React.MouseEvent, actionUrl: string) => {
    e.preventDefault();
    e.stopPropagation();
    // Extract file ID from drive URL (format: /file/d/[id]/view)
    const match = actionUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    const fileId = match ? match[1] : "";
    const downloadUrl = fileId 
      ? `https://drive.google.com/uc?export=download&id=${fileId}` 
      : actionUrl;
      
    setModalConfig({
      isOpen: true,
      downloadUrl,
      viewUrl: actionUrl
    });
  };

  /* Mouse-tracking glow */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, index: number) => {
      const glow = glowRefs.current[index];
      const card = cardsRef.current[index];
      if (!glow || !card) return;
      const rect = card.getBoundingClientRect();
      glow.style.left = `${e.clientX - rect.left}px`;
      glow.style.top = `${e.clientY - rect.top}px`;
    },
    []
  );

  /* GSAP scroll animations */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Header
    const header = section.querySelector(".researchlab-header");
    if (header) {
      gsap.fromTo(
        header,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: header,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Status strip
    const status = section.querySelector(".researchlab-status");
    if (status) {
      gsap.fromTo(
        status,
        { opacity: 0, y: 20, scaleX: 0.95 },
        {
          opacity: 1,
          y: 0,
          scaleX: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: status,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Intro text
    const intro = section.querySelector(".researchlab-intro");
    if (intro) {
      gsap.fromTo(
        intro,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: intro,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Cards staggered
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    cards.forEach((card, index) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        delay: index * 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
        onComplete: () => card.classList.add("researchlab-visible"),
      });

      // Inner elements stagger
      const innerEls = card.querySelectorAll(
        ".researchlab-card-icon, h3, .researchlab-card-desc, .researchlab-card-tags, .researchlab-card-action, .researchlab-soon-overlay"
      );
      innerEls.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: index * 0.15 + 0.2 + i * 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger && section.contains(trigger.trigger as Node)) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <div
      className="researchlab-section section-container"
      id="researchlab"
      ref={sectionRef}
    >
      {/* Header */}
      <div className="researchlab-header">
        <h2>Research Playground</h2>
        <p className="researchlab-subtitle">
          Experimental systems lab.
          <br />
          Loose, technical, and exploratory work that shapes the bigger builds.
        </p>
      </div>

      {/* Lab Status Strip */}
      <div className="researchlab-status">
        <div className="researchlab-status-badge">
          <div className="researchlab-status-pulse" />
          <span className="researchlab-status-label">lab/status</span>
        </div>
        <div className="researchlab-status-divider" />
        <p className="researchlab-status-text">
          <strong>Research before polish.</strong> This is where ideas are
          allowed to be rough: sensing networks, model probes, technical
          explanations, and Kaggle experiments that sharpen the real builds.
        </p>
      </div>

      {/* Intro */}
      <div className="researchlab-intro">
        <p>
          Each experiment below is a snapshot of active learning — not a finished
          product. Click through to read notes, view results, or explore the
          thinking behind the work.
        </p>
      </div>

      {/* Experiment Cards */}
      <div className="researchlab-grid">
        {experiments.map((exp, index) => (
          <div
            key={exp.id}
            className={`researchlab-card${
              exp.status === "soon" ? " researchlab-card--soon" : ""
            }`}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            onMouseMove={(e) => handleMouseMove(e, index)}
          >
            {/* Mouse glow */}
            <div
              className="researchlab-card-glow"
              ref={(el) => {
                glowRefs.current[index] = el;
              }}
            />

            {/* Top row */}
            <div className="researchlab-card-top">
              <span className="researchlab-card-number">{exp.id}</span>
              {exp.status === "soon" && (
                <div
                  className={`researchlab-card-chip researchlab-card-chip--${exp.status}`}
                >
                  <div className="researchlab-chip-dot" />
                  <span>Coming Soon</span>
                </div>
              )}
            </div>

            {/* Icon */}
            <div className="researchlab-card-icon">{icons[exp.icon]}</div>

            {/* Content */}
            <div className="researchlab-card-content">
              <h3>{exp.title}</h3>
              <p className="researchlab-card-desc">{exp.description}</p>

              {/* Tags */}
              <div className="researchlab-card-tags">
                {exp.tags.map((tag) => (
                  <span key={tag} className="researchlab-tag">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action button or Coming Soon overlay */}
              {exp.status === "published" && exp.actionUrl && (
                <a
                  href={exp.actionUrl}
                  className="researchlab-card-action"
                  onClick={(e) => handleActionClick(e, exp.actionUrl || "")}
                >
                  <div className="researchlab-action-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <span className="researchlab-action-text">
                    {exp.actionLabel}
                  </span>
                  <div className="researchlab-action-arrow">
                    <svg viewBox="0 0 24 24">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </div>
                </a>
              )}

              {exp.status === "soon" && (
                <div className="researchlab-soon-overlay">
                  <p className="researchlab-soon-text">Coming Soon</p>
                  <p className="researchlab-soon-sub">
                    Experiments in active development
                  </p>
                </div>
              )}
            </div>

            {/* Bottom accent */}
            <div className="researchlab-card-accent" />
          </div>
        ))}
      </div>

      {/* Access Notes Modal Dialog */}
      {modalConfig && modalConfig.isOpen && createPortal(
        <div className="notes-modal-overlay" onClick={() => setModalConfig(null)}>
          <div className="notes-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Access Notes</h3>
            <p>Do you want to download it?</p>
            <div className="notes-modal-actions">
              <a 
                href={modalConfig.downloadUrl} 
                className="notes-modal-btn download-btn"
                onClick={() => setModalConfig(null)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Yes
              </a>
              <a 
                href={modalConfig.viewUrl} 
                className="notes-modal-btn view-btn"
                onClick={() => setModalConfig(null)}
                target="_blank"
                rel="noopener noreferrer"
              >
                No (View)
              </a>
            </div>
            <button className="notes-modal-close" onClick={() => setModalConfig(null)}>
              Cancel
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ResearchLab;
