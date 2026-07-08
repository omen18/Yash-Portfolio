import { useState, useEffect, useRef } from "react";
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
      "/images/ticket_landing.png",
      "/images/ticket_future.png",
      "/images/ticket_signin.png",
      "/images/ticket_payment.png",
      "/images/ticket_review.png"
    ],
    link: "https://github.com/omen18/Ticket-Booking-System"
  },
  {
    title: "IslandPet",
    subtitle: "Gamified Focus Companion iOS App",
    category: "iOS Development",
    tools: "Swift, SwiftUI, iOS SDK, Dynamic Island Integration",
    images: [
      "/images/islandpet_home.png",
      "/images/islandpet_evolution.png",
      "/images/islandpet_mobile.png"
    ],
    link: "https://github.com/omen18/IslandPet"
  },
  {
    title: "AI Study Companion",
    subtitle: "LLM Personalized Learning Platform",
    category: "AI Integration",
    tools: "React, FastAPI, OpenAI API, LLM Agents",
    images: [
      "/images/study_landing.png",
      "/images/study_dashboard.png"
    ],
    link: "https://github.com/omen18"
  },
  {
    title: "AmritKrishi 2.0",
    subtitle: "Agri-tech Platform for Crop Insights",
    category: "Full Stack & Web Dev",
    tools: "React, Node.js, Express, PostgreSQL, Crop Analytics",
    images: [
      "/images/krishi_landing.png",
      "/images/krishi_analysis.png",
      "/images/krishi_chart.png"
    ],
    link: "https://github.com/omen18"
  },
  {
    title: "AI Delivery Route Planner",
    subtitle: "AI Delivery Web Application Design",
    category: "Algorithm & 3D Graph Optimization",
    tools: "React, Three.js, Graph Theory, A* / Dijkstra Search",
    images: [
      "/images/route_landing.png",
      "/images/route_algorithms.png",
      "/images/route_3d.png",
      "/images/route_impact.png"
    ],
    link: "https://github.com/omen18/AI-delivery-route-planner",
    liveLink: "https://ai-delivery-route-planner.vercel.app/"
  }
];

const WorkCard = ({ project, index }: { project: Project; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeImage, setActiveImage] = useState(
    project.images && project.images.length > 0 ? project.images[0] : project.image || ""
  );

  const changeImage = (newImg: string) => {
    if (activeImage === newImg) return;
    const imgEl = cardRef.current?.querySelector(".work-image img");
    if (!imgEl) {
      setActiveImage(newImg);
      return;
    }

    gsap.to(imgEl, {
      opacity: 0,
      scale: 0.95,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        setActiveImage(newImg);
        gsap.to(imgEl, {
          opacity: 1,
          scale: 1,
          duration: 0.35,
          ease: "power2.out",
        });
      }
    });
  };

  useEffect(() => {
    const images = project.images;
    if (!images || images.length <= 1) return;

    const interval = setInterval(() => {
      const currentIndex = images.indexOf(activeImage);
      const nextIndex = (currentIndex === -1 ? 0 : currentIndex + 1) % images.length;
      changeImage(images[nextIndex]);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeImage, project.images]);

  return (
    <div className="work-box" ref={cardRef}>
      <div className="work-info">
        <div className="work-title">
          <h3>0{index + 1}</h3>
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
        </div>
      </div>
    </div>
  );
};

export default Work;
