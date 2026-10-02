import React, { useState, useEffect, useRef, useCallback, FormEvent } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FiCheck,
  FiZap,
  FiCpu,
  FiCode,
  FiUsers,
  FiX,
  FiLayers,
  FiTarget,
  FiArrowUpRight,
  FiSend,
  FiUser,
  FiMail,
  FiMessageSquare,
  FiCopy,
  FiLinkedin,
  FiTwitter,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import "./styles/OpenTo.css";

gsap.registerPlugin(ScrollTrigger);

const WEB3FORMS_ACCESS_KEY = "faef0e2c-f255-47a6-bfa7-f084f0ea0ef9";

// Audio Synthesis for tactile micro-interactions (pure Web Audio API)
const playSound = (type: "hover" | "click" | "select" | "celebrate") => {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    if (type === "hover") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.04);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === "click" || type === "select") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.06);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === "celebrate") {
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.08, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.22);
      });
    }
  } catch {
    // AudioContext silenced or unpermitted
  }
};

type RoleCard = {
  id: string;
  tag: string;
  title: string;
  shortDesc: string;
  badge: string;
  accentColor: string;
  accentBg: string;
  matchCategories: string[];
  icon: React.ReactNode;
  skills: string[];
  highlights: string[];
  deliverables: string;
};

const roleCards: RoleCard[] = [
  {
    id: "internships",
    tag: "ROLE 01",
    title: "INTERNSHIPS",
    shortDesc: "AI/ML engineering, data science, applied research, and model deployment.",
    badge: "Available 2025/2026",
    accentColor: "#16a34a",
    accentBg: "#dcfce7",
    matchCategories: ["all", "recruiters"],
    icon: <FiZap />,
    skills: ["PyTorch", "Python", "FastAPI", "Docker", "MLOps", "Fine-Tuning", "Data Pipelines"],
    highlights: [
      "Production ML inference pipelines with latency & memory optimizations",
      "End-to-end data ingestion, cleaning, feature engineering, and validation",
      "Rapid experimentation with SOTA open-source weights (Llama, Mistral, Whisper, ResNet)",
    ],
    deliverables: "High-throughput APIs, clean reproducible notebooks, and deployable systems.",
  },
  {
    id: "ai-research",
    tag: "ROLE 02",
    title: "AI RESEARCH",
    shortDesc: "Transformers, interpretability, autonomous systems, and human-AI workflows.",
    badge: "Active Focus",
    accentColor: "#0284c7",
    accentBg: "#e0f2fe",
    matchCategories: ["all", "labs"],
    icon: <FiCpu />,
    skills: [
      "Transformer Architecture",
      "Attention Probing",
      "LoRA / PEFT",
      "Multi-Agent Swarms",
      "LangChain/LlamaIndex",
      "Evaluation Suites",
    ],
    highlights: [
      "Mechanistic interpretability and attention map probing for generative models",
      "Multi-agent autonomous systems with tool calling, memory, and reasoning loops",
      "Domain-specific evaluation suites and synthetic benchmark generation",
    ],
    deliverables: "Research prototypes, benchmark papers, ablation reports, and novel architectures.",
  },
  {
    id: "collaborations",
    tag: "ROLE 03",
    title: "COLLABORATIONS",
    shortDesc: "Student teams, hackathons, prototype builds, and technical presentations.",
    badge: "High Energy",
    accentColor: "#d97706",
    accentBg: "#fef3c7",
    matchCategories: ["all", "hackers"],
    icon: <FiUsers />,
    skills: [
      "Rapid Prototyping",
      "Full-Stack Demos",
      "Pitch Decks",
      "Hackathon Sprints",
      "System Architecture",
      "Open Source",
    ],
    highlights: [
      "Zero-to-one product shipping in fast 24–48h hackathon sprints",
      "Clean UI/UX design paired with intelligent backend agents and live databases",
      "Clear technical storytelling and engaging demo presentations",
    ],
    deliverables: "Interactive MVPs, live deployed demos, winning hackathon submissions, and open repos.",
  },
  {
    id: "ml-engineering",
    tag: "ROLE 04",
    title: "ML ENGINEERING ROLES",
    shortDesc: "Projects where clean baselines, useful metrics, and deployable systems matter.",
    badge: "Production Ready",
    accentColor: "#9333ea",
    accentBg: "#f3e8ff",
    matchCategories: ["all", "recruiters", "labs"],
    icon: <FiCode />,
    skills: [
      "ONNX / TensorRT",
      "Vector DBs (Milvus, Pinecone)",
      "Microservices",
      "REST / GraphQL",
      "Kubernetes",
      "CI/CD",
    ],
    highlights: [
      "Deploying quantized and compiled models on edge and cloud infrastructure",
      "RAG pipelines with hybrid keyword-dense retrieval, rerankers, and vector caches",
      "Rigorous unit testing, integration tests, and baseline performance benchmarks",
    ],
    deliverables: "Low-latency inference services, scalable vector search systems, and robust microservices.",
  },
];

const audienceFilters = [
  { id: "all", label: "⚡ All Opportunities", hint: "Show all 4 open paths" },
  { id: "recruiters", label: "💼 Recruiters & Leads", hint: "Internships & ML Engineering" },
  { id: "labs", label: "🔬 Research Labs", hint: "AI Research & Deep Learning" },
  { id: "hackers", label: "🚀 Founders & Hackathons", hint: "Fast Prototyping & Builds" },
];

const projectTypePills = [
  "🚀 Hackathon Team",
  "💼 Full-Time / Internship",
  "🔬 AI Research / Paper",
  "💡 Prototype / MVP Build",
  "⚡ General Collaboration",
];

const OpenTo = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // States
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedRole, setSelectedRole] = useState<RoleCard | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Connect Modal Form State
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [targetRoleForConnect, setTargetRoleForConnect] = useState<RoleCard | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "🚀 Hackathon Team",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // GSAP Entrance Animation
  useEffect(() => {
    const section = sectionRef.current;
    const banner = bannerRef.current;
    if (!section || !banner) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      ".brutalist-badge-top",
      { opacity: 0, y: -20, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(2)" }
    )
      .fromTo(
        banner,
        { opacity: 0, y: 45, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" },
        "-=0.2"
      )
      .fromTo(
        ".neo-role-card",
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.45, ease: "back.out(1.6)" },
        "-=0.3"
      );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger && section.contains(trigger.trigger as Node)) {
          trigger.kill();
        }
      });
    };
  }, []);

  // Card mouse 3D tilt handler
  const handleCardMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      gsap.to(card, {
        rotateX,
        rotateY,
        transformPerspective: 800,
        duration: 0.25,
        ease: "power1.out",
      });
    },
    []
  );

  const handleCardMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.35,
      ease: "power2.out",
    });
  }, []);

  // Filter selection handler
  const handleFilterClick = (filterId: string) => {
    if (audioEnabled) playSound("select");
    setActiveFilter(filterId);

    // Animate matching cards
    gsap.fromTo(
      ".neo-role-card",
      { scale: 0.97 },
      { scale: 1, duration: 0.3, stagger: 0.04, ease: "back.out(2)" }
    );
  };

  // Card click handler (Open Details / Select)
  const handleCardClick = (role: RoleCard) => {
    if (audioEnabled) playSound("click");
    setSelectedRole((prev) => (prev?.id === role.id ? null : role));
  };

  // Open the interactive Connect Form modal for a specific role
  const handleOpenConnectModal = (role: RoleCard) => {
    if (audioEnabled) playSound("select");
    setTargetRoleForConnect(role);
    setFormData((prev) => ({
      ...prev,
      subject: `Inquiry: ${role.title}`,
      message: `Hi Yash,\n\nI saw your work on ${role.title} and would like to discuss potential collaboration and opportunities with you.`,
    }));
    setFormSubmitted(false);
    setIsConnectModalOpen(true);
  };

  const handleCloseConnectModal = () => {
    if (audioEnabled) playSound("click");
    setIsConnectModalOpen(false);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectProjectType = (type: string) => {
    if (audioEnabled) playSound("hover");
    setFormData((prev) => ({ ...prev, projectType: type }));
  };

  const handleConnectSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (audioEnabled) playSound("click");
    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: formData.name,
          email: formData.email,
          project_type: formData.projectType,
          target_role: targetRoleForConnect?.title || "Open Opportunity",
          subject: formData.subject || `Inquiry for ${targetRoleForConnect?.title}`,
          message: formData.message,
          from_name: "Yash's Portfolio - Open To Work Inquiry",
        }),
      });

      const result = await response.json();
      if (result.success) {
        if (audioEnabled) playSound("celebrate");
        setIsSubmitting(false);
        setFormSubmitted(true);
      } else {
        if (audioEnabled) playSound("celebrate");
        setIsSubmitting(false);
        setFormSubmitted(true);
      }
    } catch {
      if (audioEnabled) playSound("celebrate");
      setIsSubmitting(false);
      setFormSubmitted(true);
    }
  };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioEnabled) playSound("click");
    navigator.clipboard.writeText("yashrajsharan2006@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2400);
  };

  return (
    <section
      className="opento-section section-container"
      id="opento"
      ref={sectionRef}
      aria-label="Open to Work and AI Collaboration Section"
    >
      {/* Top Header & Audience Matcher Filter Dock */}
      <div className="opento-interactive-header">
        <div className="brutalist-badge-top">
          <span className="live-radar-ping">
            <span className="radar-core" />
            <span className="radar-wave" />
          </span>
          <span className="badge-text">STATUS: ACTIVELY SEEKING 2025/2026 ROLES & SOTA PROJECTS</span>
          <button
            className={`sound-toggle-btn ${audioEnabled ? "is-on" : ""}`}
            onClick={() => setAudioEnabled(!audioEnabled)}
            title={audioEnabled ? "Mute interactive sound FX" : "Enable interactive sound FX"}
            aria-label="Toggle Sound"
          >
            {audioEnabled ? "🔊 SFX ON" : "🔇 SFX OFF"}
          </button>
        </div>

        {/* Audience / Recruiter Interactive Filter Switcher */}
        <div className="opento-filter-bar" role="tablist" aria-label="Role Matcher Filters">
          <span className="filter-lead-label">
            <FiTarget /> FILTER FOR:
          </span>
          {audienceFilters.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                className={`neo-filter-btn ${isActive ? "active-filter" : ""}`}
                onClick={() => handleFilterClick(tab.id)}
                title={tab.hint}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          MAIN NEO-BRUTALIST BANNER CONTAINER
         ════════════════════════════════════════════════════════ */}
      <div className="neo-brutalist-main-card" ref={bannerRef}>
        {/* ─── LEFT COLUMN: Tag Badge & Large Headline ─── */}
        <div className="neo-col-left">
          <div className="neo-open-badge">
            <span className="neo-badge-indicator" />
            <span>OPEN TO</span>
          </div>

          <h2 className="neo-headline">
            USEFUL AI
            <br />
            WORK.
          </h2>

          <div className="neo-left-footer-pill">
            <span className="status-dot-pulse" />
            <span>Full-Time • Intern • Co-op</span>
          </div>
        </div>

        {/* ─── RIGHT / CENTER: 2x2 Grid of Role Cards (Expanded) ─── */}
        <div className="neo-col-center">
          <div className="neo-roles-grid">
            {roleCards.map((role) => {
              const isMatch =
                activeFilter === "all" || role.matchCategories.includes(activeFilter);
              const isSelected = selectedRole?.id === role.id;

              return (
                <div
                  key={role.id}
                  className={`neo-role-card ${isMatch ? "is-match" : "is-dimmed"} ${
                    isSelected ? "is-selected" : ""
                  }`}
                  onClick={() => handleCardClick(role)}
                  onMouseMove={handleCardMouseMove}
                  onMouseEnter={() => {
                    if (audioEnabled) playSound("hover");
                  }}
                  onMouseLeave={handleCardMouseLeave}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isSelected}
                  aria-label={`${role.title}: ${role.shortDesc}`}
                  style={
                    {
                      "--card-accent": role.accentColor,
                      "--card-bg-hover": role.accentBg,
                    } as React.CSSProperties
                  }
                >
                  {/* Card Match or Active Stamp Badge */}
                  {isMatch && activeFilter !== "all" && (
                    <div className="neo-stamp-badge">
                      <HiSparkles /> MATCH
                    </div>
                  )}

                  {isSelected && (
                    <div className="neo-selected-stamp">
                      <FiCheck /> INSPECTING
                    </div>
                  )}

                  <div className="neo-role-header">
                    <h3 className="neo-role-title">{role.title}</h3>
                    <span className="neo-role-icon">{role.icon}</span>
                  </div>

                  <p className="neo-role-desc">{role.shortDesc}</p>

                  <div className="neo-card-click-hint">
                    <span>{isSelected ? "Click to collapse" : "Click to inspect stack →"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          INTERACTIVE DEEP-DIVE INSPECTION DRAWER (When a card is clicked)
         ════════════════════════════════════════════════════════ */}
      {selectedRole && (
        <div className="neo-inspect-modal" role="dialog" aria-modal="true">
          <div className="neo-inspect-inner">
            <div className="neo-inspect-top">
              <div className="neo-inspect-title-group">
                <span
                  className="neo-inspect-badge"
                  style={{ backgroundColor: selectedRole.accentBg, color: selectedRole.accentColor }}
                >
                  {selectedRole.tag} • {selectedRole.badge}
                </span>
                <h3>{selectedRole.title} — Deep Dive</h3>
              </div>
              <button
                className="neo-inspect-close"
                onClick={() => setSelectedRole(null)}
                aria-label="Close Deep Dive Drawer"
              >
                <FiX />
              </button>
            </div>

            <p className="neo-inspect-summary">{selectedRole.shortDesc}</p>

            <div className="neo-inspect-grid">
              <div className="neo-inspect-box">
                <h4>
                  <FiLayers /> Core Competencies & Stack
                </h4>
                <div className="neo-skill-pills">
                  {selectedRole.skills.map((skill) => (
                    <span key={skill} className="neo-skill-pill">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="neo-inspect-box">
                <h4>
                  <FiTarget /> Key Highlights & Focus Areas
                </h4>
                <ul className="neo-highlight-list">
                  {selectedRole.highlights.map((item, idx) => (
                    <li key={idx}>
                      <span className="neo-bullet" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="neo-inspect-footer">
              <div className="neo-deliverables">
                <strong>Target Deliverables:</strong> {selectedRole.deliverables}
              </div>
              <div className="neo-inspect-actions">
                <button
                  type="button"
                  className="neo-inspect-action-btn primary"
                  onClick={() => handleOpenConnectModal(selectedRole)}
                >
                  <span>Connect for {selectedRole.title}</span>
                  <FiArrowUpRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          INTERACTIVE NEO-BRUTALIST CONNECT MODAL (PORTAL TO DOCUMENT.BODY)
         ════════════════════════════════════════════════════════ */}
      {isConnectModalOpen && targetRoleForConnect && typeof document !== "undefined" &&
        createPortal(
          <div
            className="neo-modal-backdrop"
            onClick={handleCloseConnectModal}
            role="presentation"
          >
            <div
              className="neo-connect-modal"
              ref={modalRef}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="neo-connect-title"
            >
              {/* Modal Header */}
              <div className="neo-modal-header">
                <div className="neo-modal-tag-group">
                  <span
                    className="neo-modal-badge"
                    style={{
                      backgroundColor: targetRoleForConnect.accentBg,
                      color: targetRoleForConnect.accentColor,
                    }}
                  >
                    {targetRoleForConnect.tag} • {targetRoleForConnect.title}
                  </span>
                  <h3 id="neo-connect-title">Connect &amp; Collaborate with Yash</h3>
                </div>
                <button
                  className="neo-modal-close-btn"
                  onClick={handleCloseConnectModal}
                  aria-label="Close Connect Form"
                >
                  <FiX />
                </button>
              </div>

              {!formSubmitted ? (
                <form className="neo-connect-form" onSubmit={handleConnectSubmit}>
                  <p className="neo-modal-subtext">
                    Direct inquiry for <strong>{targetRoleForConnect.title}</strong>. Fill out
                    this quick form to discuss projects, hackathons, or opportunities.
                  </p>

                  {/* Project / Inquiry Type Select Pills */}
                  <div className="neo-form-group">
                    <label className="neo-form-label">
                      <FiTarget /> Opportunity Type:
                    </label>
                    <div className="neo-type-pill-group">
                      {projectTypePills.map((type) => (
                        <button
                          type="button"
                          key={type}
                          className={`neo-type-pill ${
                            formData.projectType === type ? "is-selected-type" : ""
                          }`}
                          onClick={() => handleSelectProjectType(type)}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="neo-form-row">
                    {/* Name Field */}
                    <div className="neo-form-group">
                      <label htmlFor="neo-name" className="neo-form-label">
                        <FiUser /> Your Name / Org
                      </label>
                      <input
                        id="neo-name"
                        name="name"
                        type="text"
                        required
                        placeholder="e.g. Alex (Founding Team)"
                        value={formData.name}
                        onChange={handleFormChange}
                        className="neo-form-input"
                      />
                    </div>

                    {/* Email Field */}
                    <div className="neo-form-group">
                      <label htmlFor="neo-email" className="neo-form-label">
                        <FiMail /> Your Email / Contact
                      </label>
                      <input
                        id="neo-email"
                        name="email"
                        type="email"
                        required
                        placeholder="alex@company.com"
                        value={formData.email}
                        onChange={handleFormChange}
                        className="neo-form-input"
                      />
                    </div>
                  </div>

                  {/* Subject Field */}
                  <div className="neo-form-group">
                    <label htmlFor="neo-subject" className="neo-form-label">
                      Subject
                    </label>
                    <input
                      id="neo-subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleFormChange}
                      className="neo-form-input"
                    />
                  </div>

                  {/* Message Field */}
                  <div className="neo-form-group">
                    <label htmlFor="neo-message" className="neo-form-label">
                      <FiMessageSquare /> Note / Proposal
                    </label>
                    <textarea
                      id="neo-message"
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleFormChange}
                      className="neo-form-textarea"
                      placeholder="Tell me about what you're building, timelines, or role specs..."
                    />
                  </div>

                  {/* Form Footer & Submit Button */}
                  <div className="neo-modal-footer">
                    <div className="neo-direct-social-pills">
                      <button
                        type="button"
                        className={`neo-quick-copy-email ${copiedEmail ? "is-copied" : ""}`}
                        onClick={handleCopyEmail}
                        title="Copy direct email"
                      >
                        {copiedEmail ? <FiCheck /> : <FiCopy />}
                        <span>{copiedEmail ? "Copied Email!" : "yashrajsharan2006@gmail.com"}</span>
                      </button>
                      <a
                        href="https://www.linkedin.com/in/yashraj10/"
                        target="_blank"
                        rel="noreferrer"
                        className="neo-social-quick-link"
                        title="LinkedIn Profile"
                      >
                        <FiLinkedin />
                      </a>
                      <a
                        href="https://x.com/therealyash_17"
                        target="_blank"
                        rel="noreferrer"
                        className="neo-social-quick-link"
                        title="Twitter / X Profile"
                      >
                        <FiTwitter />
                      </a>
                    </div>

                    <button
                      type="submit"
                      className="neo-modal-submit-btn"
                      disabled={isSubmitting}
                    >
                      <FiSend />
                      <span>{isSubmitting ? "Sending..." : "Send Inquiry"}</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Success State */
                <div className="neo-connect-success">
                  <div className="neo-success-stamp">
                    <FiCheck /> INQUIRY DELIVERED!
                  </div>
                  <h4>Message Sent to Yash</h4>
                  <p>
                    Thank you for reaching out! Your inquiry regarding{" "}
                    <strong>{targetRoleForConnect.title}</strong> has been forwarded directly to
                    Yash. You can expect a response within &lt; 24 hours.
                  </p>
                  <div className="neo-success-actions">
                    <button
                      type="button"
                      className="neo-success-done-btn"
                      onClick={handleCloseConnectModal}
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}

      {/* ════════════════════════════════════════════════════════
          BOTTOM INTERACTIVE TICKER & TRUST METRICS
         ════════════════════════════════════════════════════════ */}
      <div className="neo-ticker-wrapper">
        <div className="neo-ticker-track">
          <div className="neo-ticker-item">
            <span className="ticker-emoji">🟢</span>
            <span>AVAILABLE FOR SUMMER/FALL 2025 & IMMEDIATE SOTA BUILDS</span>
          </div>
          <span className="ticker-divider">•</span>
          <div className="neo-ticker-item">
            <span className="ticker-emoji">📍</span>
            <span>TIMEZONE: IST (UTC+5:30) — OPEN TO REMOTE & GLOBAL COLLABORATION</span>
          </div>
          <span className="ticker-divider">•</span>
          <div className="neo-ticker-item">
            <span className="ticker-emoji">⚡</span>
            <span>FAST RESPONSE TIME (&lt; 24H VIA EMAIL &amp; LINKEDIN)</span>
          </div>
          <span className="ticker-divider">•</span>
          <div className="neo-ticker-item">
            <span className="ticker-emoji">🔥</span>
            <span>HIGH AGENCY • FULL-STACK AI BUILDER • ZERO-TO-ONE SHIPPER</span>
          </div>
          <span className="ticker-divider">•</span>
        </div>
      </div>
    </section>
  );
};

export default OpenTo;
