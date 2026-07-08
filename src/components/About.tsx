import { useEffect, useState } from "react";
import "./styles/About.css";

const traits = [
  {
    title: "Tactical FPS Brain",
    desc: "I like problems where timing, information, and decisions all matter.",
  },
  {
    title: "Pattern Hunter",
    desc: "Hidden structure, messy clues, and technical rabbit holes are my comfort zone.",
  },
  {
    title: "Gym Enthusiast",
    desc: "Progressive overload applies to code, models, and training logs.",
  },
  {
    title: "AI Agent Curious",
    desc: "I’m interested in tools that can plan, act, and explain themselves.",
  },
  {
    title: "Systems Builder",
    desc: "SensaNet, robotics-adjacent AI, and industrial intelligence keep pulling me in.",
  },
];

const About = () => {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % traits.length);
        setIsAnimating(false);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">About Me</h3>
        <p className="para">
          I'm Yash Raj Sharan — a Full Stack Developer and AI Engineer who
          builds end-to-end applications and generative AI solutions. I'm
          constantly diving deeper into Deep Learning, MLOps, and AI
          Infrastructure — turning cutting-edge research into production-ready,
          intelligent systems.
        </p>

        {/* Trait Rotator */}
        <div className="about-trait-container">
          <div className={`about-trait-content ${isAnimating ? "about-trait-fade" : ""}`}>
            <h4 className="about-trait-title">
              <span>//</span> {traits[index].title}
            </h4>
            <p className="about-trait-desc">{traits[index].desc}</p>
          </div>
          {/* Progress Indicators */}
          <div className="about-trait-indicators">
            {traits.map((_, i) => (
              <span
                key={i}
                className={`about-trait-dot ${i === index ? "about-trait-dot-active" : ""}`}
                onClick={() => {
                  if (i !== index && !isAnimating) {
                    setIsAnimating(true);
                    setTimeout(() => {
                      setIndex(i);
                      setIsAnimating(false);
                    }, 500);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
