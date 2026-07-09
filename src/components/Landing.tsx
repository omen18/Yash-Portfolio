import { PropsWithChildren, useEffect, useState } from "react";
import "./styles/Landing.css";

const roles = [
  "Full Stack Dev",
  "AI Engineer",
  "GenAI Engineer",
  "LLM Engineer",
];

const Landing = ({ children }: PropsWithChildren) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    let timeoutId: any;
    const interval = setInterval(() => {
      setIsSliding(true);
      
      // Sync the state swap with the CSS transition duration (800ms)
      timeoutId = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % roles.length);
        setIsSliding(false);
      }, 800);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, []);

  const nextIndex = (currentIndex + 1) % roles.length;

  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              YASH RAJ
              <br />
              <span>SHARAN</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>A <span>Creative</span></h3>
            <div className="role-rotator">
              <div className={`role-track ${isSliding ? "role-sliding" : ""}`}>
                <div className="role-item">{roles[currentIndex]}</div>
                <div className="role-item">{roles[nextIndex]}</div>
              </div>
            </div>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
