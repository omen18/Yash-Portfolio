import { useEffect, useRef } from "react";
import "./styles/WhatIDo.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const WhatIDo = () => {
  const containerRef = useRef<(HTMLDivElement | null)[]>([]);
  const setRef = (el: HTMLDivElement | null, index: number) => {
    containerRef.current[index] = el;
  };
  useEffect(() => {
    const listeners: { container: HTMLDivElement; handler: () => void }[] = [];
    if (ScrollTrigger.isTouch) {
      containerRef.current.forEach((container) => {
        if (container) {
          const handler = () => handleClick(container);
          container.classList.remove("what-noTouch");
          container.addEventListener("click", handler);
          listeners.push({ container, handler });
        }
      });
    }
    return () => {
      listeners.forEach(({ container, handler }) => {
        container.removeEventListener("click", handler);
      });
    };
  }, []);
  return (
    <div className="whatIDO">
      <div className="what-box">
        <h2 className="title">
          W<span className="hat-h2">HAT</span>
          <div>
            I<span className="do-h2"> DO</span>
          </div>
        </h2>
      </div>
      <div className="what-box">
        <div className="what-box-in">
          <div className="what-border2">
            <svg width="100%">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
              <line
                x1="100%"
                y1="0"
                x2="100%"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
            </svg>
          </div>
          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 0)}
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>

            <div className="what-content-in">
              <h3>FULL STACK</h3>
              <h4>End-to-End Engineering</h4>
              <p>
                Building scalable, production-ready applications from pixel-perfect
                frontends to robust backend architectures.
              </p>
              
              <div className="skills-scroll-container" data-cursor="disable">
                <div className="skills-category">
                  <h5 className="skills-category-title">Programming Languages</h5>
                  <div className="what-content-flex">
                    <div className="what-tags">JavaScript</div>
                    <div className="what-tags">TypeScript</div>
                    <div className="what-tags">Python</div>
                    <div className="what-tags">Java</div>
                    <div className="what-tags">Rust</div>
                    <div className="what-tags">Swift</div>
                  </div>
                </div>

                <div className="skills-category">
                  <h5 className="skills-category-title">Frontend</h5>
                  <div className="what-content-flex">
                    <div className="what-tags">HTML</div>
                    <div className="what-tags">CSS</div>
                    <div className="what-tags">React</div>
                    <div className="what-tags">Next.js</div>
                    <div className="what-tags">Three.js</div>
                  </div>
                </div>

                <div className="skills-category">
                  <h5 className="skills-category-title">Backend</h5>
                  <div className="what-content-flex">
                    <div className="what-tags">Node.js</div>
                    <div className="what-tags">Express.js</div>
                    <div className="what-tags">FastAPI</div>
                    <div className="what-tags">Java</div>
                    <div className="what-tags">Rust</div>
                  </div>
                </div>

                <div className="skills-category">
                  <h5 className="skills-category-title">Databases</h5>
                  <div className="what-content-flex">
                    <div className="what-tags">PostgreSQL</div>
                    <div className="what-tags">MongoDB</div>
                    <div className="what-tags">MySQL</div>
                  </div>
                </div>

                <div className="skills-category">
                  <h5 className="skills-category-title">Mobile Development</h5>
                  <div className="what-content-flex">
                    <div className="what-tags">Swift (iOS Development)</div>
                    <div className="what-tags">SwiftUI</div>
                  </div>
                </div>

                <div className="skills-category">
                  <h5 className="skills-category-title">Cloud & DevOps</h5>
                  <div className="what-content-flex">
                    <div className="what-tags">Docker</div>
                    <div className="what-tags">AWS</div>
                  </div>
                </div>
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>
          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 1)}
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>
            <div className="what-content-in">
              <h3>AI & GENAI</h3>
              <h4>Intelligent Systems</h4>
              <p>
                Designing generative AI pipelines, fine-tuning LLMs,
                and building intelligent agentic systems.
              </p>
              
              <div className="skills-scroll-container" data-cursor="disable">
                <div className="skills-category">
                  <h5 className="skills-category-title">AI / ML Core</h5>
                  <div className="what-content-flex">
                    <div className="what-tags">Machine Learning</div>
                    <div className="what-tags">Deep Learning</div>
                    <div className="what-tags">Generative AI (LLMs)</div>
                    <div className="what-tags">PyTorch</div>
                    <div className="what-tags">TensorFlow</div>
                    <div className="what-tags">NumPy</div>
                    <div className="what-tags">Pandas</div>
                  </div>
                </div>

                <div className="skills-category">
                  <h5 className="skills-category-title">Generative AI & LLMs</h5>
                  <div className="what-content-flex">
                    <div className="what-tags">LangChain</div>
                    <div className="what-tags">OpenAI API</div>
                    <div className="what-tags">HuggingFace</div>
                    <div className="what-tags">RAG</div>
                    <div className="what-tags">Vector DBs</div>
                    <div className="what-tags">Fine-Tuning</div>
                    <div className="what-tags">Prompt Engineering</div>
                  </div>
                </div>

                <div className="skills-category">
                  <h5 className="skills-category-title">Tools & Integration</h5>
                  <div className="what-content-flex">
                    <div className="what-tags">Git</div>
                    <div className="what-tags">Jupyter Notebook</div>
                    <div className="what-tags">Google Colab</div>
                    <div className="what-tags">GitHub API</div>
                  </div>
                </div>
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;

function handleClick(container: HTMLDivElement) {
  container.classList.toggle("what-content-active");
  container.classList.remove("what-sibling");
  if (container.parentElement) {
    const siblings = Array.from(container.parentElement.children);

    siblings.forEach((sibling) => {
      if (sibling !== container) {
        sibling.classList.remove("what-content-active");
        sibling.classList.toggle("what-sibling");
      }
    });
  }
  
  // Refresh ScrollTrigger immediately and after CSS height transition ends
  ScrollTrigger.refresh();
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 400);
}
