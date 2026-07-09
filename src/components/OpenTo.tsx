import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/OpenTo.css";

gsap.registerPlugin(ScrollTrigger);

type FinderFolder = {
  id: string;
  title: string;
  sidebarLabel: string;
  description: string;
  tags: string[];
  iconType: "folder" | "openFolder";
  fileDetails: string;
};

const finderFolders: FinderFolder[] = [
  {
    id: "internships",
    sidebarLabel: "Internship",
    title: "Internships",
    description: "AI/ML engineering, data science, applied research, and model deployment.",
    tags: ["AI/ML Eng", "Data Science", "Research", "Deployment"],
    iconType: "folder",
    fileDetails: "4 items • 4.2 KB",
  },
  {
    id: "research",
    sidebarLabel: "AI Research",
    title: "AI Research",
    description: "Transformers, interpretability, autonomous systems, and human-AI workflows.",
    tags: ["Transformers", "Interpretability", "Robotics", "Workflows"],
    iconType: "openFolder",
    fileDetails: "4 items • 5.1 KB",
  },
  {
    id: "fullstack",
    sidebarLabel: "Full Stack / AIML Engineer",
    title: "Full Stack / AI-ML Engineer",
    description: "Building production-ready systems from frontend UI to scalable ML inference pipelines.",
    tags: ["React", "Next.js", "FastAPI", "Docker"],
    iconType: "folder",
    fileDetails: "4 items • 8.6 KB",
  },
  {
    id: "cloud",
    sidebarLabel: "Cloud",
    title: "Cloud & Deployment",
    description: "Deploying intelligent applications, optimizing latency, and managing cloud systems.",
    tags: ["AWS", "GCP", "Kubernetes", "CI/CD"],
    iconType: "folder",
    fileDetails: "4 items • 6.2 KB",
  },
  {
    id: "opensource",
    sidebarLabel: "Open Source",
    title: "Open Source Contributions",
    description: "Contributing to community libraries, building open infrastructure, and fixing pipelines.",
    tags: ["GitHub Actions", "Git", "Package Dev", "PR Review"],
    iconType: "folder",
    fileDetails: "4 items • 3.5 KB",
  },
  {
    id: "collaboration",
    sidebarLabel: "Collaboration",
    title: "Collaborations",
    description: "Hackathons, student research teams, rapid prototypes, and technical presentations.",
    tags: ["Hackathons", "Rapid Prototyping", "Demos", "System Design"],
    iconType: "openFolder",
    fileDetails: "4 items • 7.1 KB",
  },
];

// Folder SVG Icon
const FolderIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

// Open Folder SVG Icon
const OpenFolderIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const OpenTo = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Active folder selection transition helper
  const changeFolder = useCallback((newIndex: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIndex(newIndex);
      setIsAnimating(false);
    }, 450);
  }, []);

  // Automatic rotation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % finderFolders.length);
        setIsAnimating(false);
      }, 450);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handleSidebarClick = (index: number) => {
    if (index === activeIndex || isAnimating) return;
    changeFolder(index);
  };

  // Navigation arrows controls
  const handlePrev = () => {
    if (isAnimating) return;
    const prevIdx = (activeIndex - 1 + finderFolders.length) % finderFolders.length;
    changeFolder(prevIdx);
  };

  const handleNext = () => {
    if (isAnimating) return;
    const nextIdx = (activeIndex + 1) % finderFolders.length;
    changeFolder(nextIdx);
  };

  // Scroll Trigger Entrance Animation
  useEffect(() => {
    const section = sectionRef.current;
    const finder = windowRef.current;
    if (!section || !finder) return;

    // Header animate
    const header = section.querySelector(".opento-header");
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

    // Finder card wrapper entrance animate
    gsap.fromTo(
      finder,
      { opacity: 0, y: 50, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: finder,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger && section.contains(trigger.trigger as Node)) {
          trigger.kill();
        }
      });
    };
  }, []);

  const activeFolder = finderFolders[activeIndex];

  return (
    <div
      className="opento-section section-container"
      id="opento"
      ref={sectionRef}
    >
      {/* Header */}
      <div className="opento-header">
        <h2>
          <span className="opento-title-open">Open to </span>
          <span className="opento-title-work">Work</span>
        </h2>
        <p className="opento-subtitle">Useful AI work.</p>
        <p className="opento-tagline">Collaboration & Opportunities</p>
      </div>

      {/* Finder Window */}
      <div className="opento-finder-window" ref={windowRef}>
        {/* Title Bar */}
        <div className="opento-finder-titlebar">
          <div className="opento-finder-controls">
            <span className="opento-finder-dot opento-finder-dot--red" />
            <span className="opento-finder-dot opento-finder-dot--yellow" />
            <span className="opento-finder-dot opento-finder-dot--green" />
          </div>

          <div className="opento-finder-arrows">
            <div className="opento-finder-arrow" onClick={handlePrev}>
              <svg viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </div>
            <div className="opento-finder-arrow" onClick={handleNext}>
              <svg viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>

          <div className="opento-finder-title">
            <FolderIcon /> open to work
          </div>
        </div>

        {/* Finder Main Body */}
        <div className="opento-finder-body">
          {/* Sidebar (Left) */}
          <div className="opento-finder-sidebar">
            <div className="opento-sidebar-label">Favorites</div>
            <div className="opento-sidebar-list">
              {finderFolders.map((folder, index) => (
                <div
                  key={folder.id}
                  className={`opento-sidebar-item ${
                    index === activeIndex ? "opento-sidebar-item-active" : ""
                  }`}
                  onClick={() => handleSidebarClick(index)}
                >
                  {folder.iconType === "folder" ? <FolderIcon /> : <OpenFolderIcon />}
                  <span>{folder.sidebarLabel}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Content Pane (Right) */}
          <div className="opento-finder-content">
            <div className="opento-content-path">
              open to work &gt; <span>{activeFolder.sidebarLabel}</span>
            </div>

            {/* Folder content layout with fade logic */}
            <div
              className={`opento-content-inner ${
                isAnimating ? "opento-content-fade" : ""
              }`}
            >
              <h3>{activeFolder.title}</h3>
              <p>{activeFolder.description}</p>

              <div className="opento-content-tags">
                {activeFolder.tags.map((tag) => (
                  <span key={tag} className="opento-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="opento-finder-statusbar">
          {activeFolder.fileDetails} • 512 GB available
        </div>
      </div>
    </div>
  );
};

export default OpenTo;
