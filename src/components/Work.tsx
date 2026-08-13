import { useState, useEffect } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type Project = {
  title: string;
  subtitle: string;
  category: string;
  tools: string;
  image?: string;
  images?: string[];
  placeholderText?: string;
  link: string;
  liveLink?: string;
};

const projectsList: Project[] = [
  {
    title: "Ticket Booking System",
    subtitle: "Full-Stack Booking Platform",
    category: "Full Stack & Database Architecture",
    tools: "React, TypeScript, Node.js, Express, MySQL",
    images: [
      "/images/ticket_showpass_landing.png",
      "/images/ticket_showpass_features.png",
      "/images/ticket_showpass_book.png",
      "/images/ticket_showpass_events.png",
      "/images/ticket_showpass_visit.png"
    ],
    link: "https://github.com/omen18/Ticket-Booking-System",
    liveLink: "https://show-pass-lemon.vercel.app/"
  },
  {
    title: "IslandPet",
    subtitle: "Gamified Focus Companion iOS App",
    category: "iOS Development",
    tools: "Swift, SwiftUI, iOS SDK, Dynamic Island Integration",
    images: [
      "/images/islandpet_desktop_home.png",
      "/images/islandpet_desktop_evolution.png",
      "/images/islandpet_mobile_home.png",
      "/images/islandpet_mobile_evolution.png"
    ],
    link: "https://github.com/omen18/IslandPet"
  },
  {
    title: "AI Study Companion",
    subtitle: "LLM Personalized Learning Platform",
    category: "AI Integration",
    tools: "React, FastAPI, OpenAI API, LLM Agents",
    images: [
      "/images/study_showcase_landing.png",
      "/images/study_showcase_dashboard.png"
    ],
    link: "https://github.com/omen18/ai-study-companion"
  },
  {
    title: "AmritKrishi 2.0",
    subtitle: "Agri-tech Platform for Crop Insights",
    category: "Full Stack & Web Dev",
    tools: "React, Node.js, Express, PostgreSQL, Crop Analytics",
    images: [
      "/images/krishi_showcase_landing.png",
      "/images/krishi_showcase_analysis.png",
      "/images/krishi_showcase_chart.png"
    ],
    link: "https://github.com/omen18/amritkrishi2.0/tree/master"
  },
  {
    title: "AI Delivery Route Planner",
    subtitle: "AI Delivery Web Application Design",
    category: "Algorithm & 3D Graph Optimization",
    tools: "React, Three.js, Graph Theory, A* / Dijkstra Search",
    images: [
      "/images/route_showcase_landing.png",
      "/images/route_showcase_algorithms.png",
      "/images/route_showcase_3d.png",
      "/images/route_showcase_impact.png",
      "/images/route_showcase_comparison.png"
    ],
    link: "https://github.com/omen18/AI-delivery-route-planner",
    liveLink: "https://ai-delivery-route-planner.vercel.app/"
  },
  {
    title: "CutisAI",
    subtitle: "Clinical AI Dermatology & Skin Lesion Screening Engine",
    category: "AI Medical Perception & Clinical Intelligence",
    tools: "ResUNet, EfficientNet-B0, React, ONNX, ISIC Dataset, Clinical AI",
    images: [
      "/images/cutis_showcase_landing.png",
      "/images/cutis_showcase_clinical.png",
      "/images/cutis_showcase_portals.png",
      "/images/cutis_showcase_patient.png",
      "/images/cutis_showcase_splash.png"
    ],
    link: "https://github.com/omen18/CutisAI.git"
  },
  {
    title: "CodeStride",
    subtitle: "Open-Source Developer Productivity & Goal Tracking Dashboard",
    category: "Developer Productivity & Open-Source Analytics",
    tools: "React, Next.js, GitHub OAuth API, Contribution Heatmaps, PR Velocity",
    images: [
      "/images/codestride_landing.png",
      "/images/codestride_features.png",
      "/images/codestride_auth.png"
    ],
    link: "https://github.com/omen18/CodeStride.git"
  },
  {
    title: "MacDeck",
    subtitle: "iOS and macOS App — Low-Latency Remote Desktop & Element-Snapping Controller",
    category: "iOS and macOS Development",
    tools: "Swift 5.9, SwiftUI, ScreenCaptureKit, VideoToolbox, Network.framework, CoreGraphics",
    images: [
      "/images/macdeck_screen_display.png",
      "/images/macdeck_guest_guard.png",
      "/images/macdeck_file_explorer.png",
      "/images/macdeck_power_control.png",
      "/images/macdeck_terminal_shell.png"
    ],
    link: "https://github.com/omen18/MacDeck"
  },
  {
    title: "Musify",
    subtitle: "Flutter Music Streaming & Offline Audio Player with Lyrics & SponsorBlock",
    category: "Mobile & Audio Engineering",
    tools: "Flutter, Dart, Material 3, YouTube API, Offline Audio Cache, SponsorBlock",
    images: [
      "/images/musify_banner.png",
      "/images/musify_home.png",
      "/images/musify_player.png",
      "/images/musify_library.png",
      "/images/musify_album.png"
    ],
    link: "https://github.com/omen18/Musify.git"
  }
];

const WorkCard = ({ project, index }: { project: Project; index: number }) => {
  const [activeImage, setActiveImage] = useState(
    project.images && project.images.length > 0 ? project.images[0] : project.image || ""
  );

  useEffect(() => {
    const images = project.images;
    if (!images || images.length <= 1) return;

    let idx = images.indexOf(activeImage);
    if (idx === -1) idx = 0;

    const interval = setInterval(() => {
      idx = (idx + 1) % images.length;
      setActiveImage(images[idx]);
    }, 4500);

    return () => clearInterval(interval);
  }, [project.images]);

  const isEven = index % 2 === 1;

  return (
    <div className={`work-box ${isEven ? "even-card" : ""}`}>
      <div className="work-info">
        <div className="work-title">
          <h3>{String(index + 1).padStart(2, "0")}</h3>
          <div>
            <h4>{project.title}</h4>
            <p>{project.subtitle}</p>
          </div>
        </div>
        <h4>{project.category}</h4>
        <p>{project.tools}</p>
      </div>

      <div className="work-gallery-wrapper">
        <WorkImage 
          image={activeImage} 
          alt={project.title} 
          link={project.link} 
          liveLink={project.liveLink} 
          placeholderText={project.placeholderText}
        />
      </div>
    </div>
  );
};

const Work = () => {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1025px)", () => {
      const getTranslateX = () => {
        const boxes = document.querySelectorAll(".work-box");
        const workFlex = document.querySelector(".work-flex");
        if (boxes.length === 0 || !workFlex) return 0;
        
        const rect = boxes[0].getBoundingClientRect();
        const parentWidth = workFlex.clientWidth;
        const totalWidth = rect.width * boxes.length;
        
        return Math.max(0, totalWidth - parentWidth + 120);
      };

      let timeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".work-section",
          start: "top top",
          end: () => `+=${getTranslateX()}`,
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
          id: "work",
        },
      });

      timeline.to(".work-flex", {
        x: () => -getTranslateX(),
        ease: "none",
      });
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {projectsList.map((project, index) => (
            <WorkCard project={project} index={index} key={index} />
          ))}

          {/* Coming Soon Card */}
          <div className="work-box coming-soon-card">
            <div className="coming-soon-inner">
              <div className="coming-soon-glow"></div>
              <div className="coming-soon-content">
                <span className="coming-soon-badge">NEXT UP</span>
                <h3>{String(projectsList.length + 1).padStart(2, "0")}</h3>
                <h4>Coming Soon</h4>
                <p className="coming-soon-desc">
                  Next project is based on <span className="coming-soon-highlight">Machine Learning</span> — building intelligent systems that learn, adapt, and predict.
                </p>
                <div className="coming-soon-tags">
                  <span>ML Pipelines</span>
                  <span>Neural Networks</span>
                  <span>Data Science</span>
                  <span>Model Deployment</span>
                </div>
                <div className="coming-soon-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
