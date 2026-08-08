import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import "./styles/Career.css";

const careerRoles = [
  "Full Stack Developer",
  "iOS Developer",
  "AI Engineer",
  "GenAI Engineer",
  "LLM Engineer",
];

const Career = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      setIsSliding(true);
      timeoutId = setTimeout(() => {
        setRoleIndex((prev) => (prev + 1) % careerRoles.length);
        setIsSliding(false);
      }, 800);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, []);

  const nextRoleIndex = (roleIndex + 1) % careerRoles.length;

  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>B.Tech CSE with AIML</h4>
                <h5>SRM Institute of Science and Technology</h5>
              </div>
              <h3>2024 - 2028</h3>
            </div>
            <div className="career-info-box-right">
              <p>
                Pursuing a Bachelor's degree in Computer Science & Engineering
                with a specialization in Artificial Intelligence and Machine
                Learning. Building a strong foundation in data structures,
                algorithms, deep learning, and software engineering principles.
              </p>
            </div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <div className="career-role-rotator">
                  <div className={`career-role-track ${isSliding ? "career-role-sliding" : ""}`}>
                    <h4 className="career-role-item">{careerRoles[roleIndex]}</h4>
                    <h4 className="career-role-item">{careerRoles[nextRoleIndex]}</h4>
                  </div>
                </div>
                <h5>Self-Driven · Building & Shipping</h5>
              </div>
              <h3>2024 - NOW</h3>
            </div>
            <div className="career-info-box-right">
              <p>
                Actively developing expertise in full stack development with
                React, Next.js, Node.js, and Python while diving deep into
                Generative AI — working with LLMs, LangChain, RAG pipelines,
                prompt engineering, and fine-tuning models. Continuously building
                projects, contributing to open-source, and turning ideas into
                production-ready AI-powered applications.
              </p>
            </div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>iOS Developer</h4>
                <h5>Self-Driven · Swift & Native Systems</h5>
              </div>
              <h3>JAN 2025 - NOW</h3>
            </div>
            <div className="career-info-box-right">
              <p>
                Self-driven iOS developer focused on writing code, continuously learning more about developing native iOS apps, and crafting high-performance applications with Swift, SwiftUI, and low-latency system-level Apple APIs. Built production iOS apps including interactive Dynamic Island tools and ultra-low-latency remote Mac control suites.
              </p>
              <div className="career-links">
                <a
                  href="https://github.com/omen18/IslandPet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="career-link-badge"
                >
                  <FaGithub size={14} />
                  IslandPet (iOS)
                  <svg
                    className="career-link-arrow"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
                <a
                  href="https://github.com/omen18/MacDeck"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="career-link-badge"
                >
                  <FaGithub size={14} />
                  MacDeck (iOS/macOS)
                  <svg
                    className="career-link-arrow"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>GSSoC Contributor</h4>
                <h5>Open Source Track · AI Agent Track</h5>
              </div>
              <h3>MAY 2025 - NOW</h3>
            </div>
            <div className="career-info-box-right">
              <p>
                Contributing to GirlScript Summer of Code as an active
                open-source contributor across multiple tracks. Working on the
                Open Source Track to build and improve community-driven projects,
                and the AI Agent Track to design and develop intelligent
                autonomous agents. Collaborating with developers worldwide,
                submitting impactful PRs, and gaining hands-on experience in
                real-world codebases and AI-powered systems.
              </p>
              <div className="career-links">
                <a
                  href="https://drive.google.com/file/d/1gaXxNiam1-h45JJLs1NZwQToiceJdhWG/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="career-link-badge"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  Certificate 1
                  <svg
                    className="career-link-arrow"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
                <a
                  href="https://drive.google.com/file/d/1jTZ4_p1KqnK9kT2x95sMmV7Lg_Hq8OhG/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="career-link-badge"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  Certificate 2
                  <svg
                    className="career-link-arrow"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
