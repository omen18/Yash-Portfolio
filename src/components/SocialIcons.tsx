import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import { useEffect, useState } from "react";
import HoverLinks from "./HoverLinks";

const SocialIcons = () => {
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const social = document.getElementById("social") as HTMLElement;

    social.querySelectorAll("span").forEach((item) => {
      const elem = item as HTMLElement;
      const link = elem.querySelector("a") as HTMLElement;

      const rect = elem.getBoundingClientRect();
      let mouseX = rect.width / 2;
      let mouseY = rect.height / 2;
      let currentX = 0;
      let currentY = 0;

      const updatePosition = () => {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        link.style.setProperty("--siLeft", `${currentX}px`);
        link.style.setProperty("--siTop", `${currentY}px`);

        requestAnimationFrame(updatePosition);
      };

      const onMouseMove = (e: MouseEvent) => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x < 40 && x > 10 && y < 40 && y > 5) {
          mouseX = x;
          mouseY = y;
        } else {
          mouseX = rect.width / 2;
          mouseY = rect.height / 2;
        }
      };

      document.addEventListener("mousemove", onMouseMove);

      updatePosition();

      return () => {
        elem.removeEventListener("mousemove", onMouseMove);
      };
    });
  }, []);

  const handleResumeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowDialog(true);
  };

  const handleDownload = () => {
    setShowDialog(false);
    // Direct Google Drive download URL
    window.open("https://drive.google.com/uc?export=download&id=1jBwSPItbX3k2b1rJ7vel3c4JM8PuX2qG", "_blank");
  };

  const handleView = () => {
    setShowDialog(false);
    // View Google Drive URL
    window.open("https://drive.google.com/file/d/1jBwSPItbX3k2b1rJ7vel3c4JM8PuX2qG/view?usp=sharing", "_blank");
  };

  return (
    <>
      <div className="icons-section">
        <div className="social-icons" data-cursor="icons" id="social">
          <span>
            <a href="https://github.com/omen18" target="_blank">
              <FaGithub />
            </a>
          </span>
          <span>
            <a href="https://www.linkedin.com/in/yashraj10/" target="_blank">
              <FaLinkedinIn />
            </a>
          </span>
          <span>
            <a href="https://x.com/therealyash_17" target="_blank">
              <FaXTwitter />
            </a>
          </span>
          <span>
            <a href="https://www.instagram.com/therealyash.18/" target="_blank">
              <FaInstagram />
            </a>
          </span>
        </div>
        <a 
          className="resume-button" 
          href="#" 
          onClick={handleResumeClick}
        >
          <HoverLinks text="RESUME" />
          <span>
            <TbNotes />
          </span>
        </a>
      </div>

      {showDialog && (
        <div className="resume-modal-overlay" onClick={() => setShowDialog(false)}>
          <div className="resume-modal" onClick={(e) => e.stopPropagation()}>
            <div className="resume-modal-glow" />
            <h3>DOWNLOAD RESUME?</h3>
            <p>Select <strong>Yes</strong> to download the PDF directly, or <strong>No</strong> to view it online.</p>
            <div className="resume-modal-buttons">
              <button className="resume-btn resume-btn-yes" onClick={handleDownload}>
                YES (DOWNLOAD)
              </button>
              <button className="resume-btn resume-btn-no" onClick={handleView}>
                NO (VIEW)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SocialIcons;
