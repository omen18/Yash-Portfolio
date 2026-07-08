import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FiGlobe } from "react-icons/fi";

interface Props {
  image: string;
  alt?: string;
  video?: string;
  link?: string;
  liveLink?: string;
}

const WorkImage = (props: Props) => {
  const [isVideo, setIsVideo] = useState(false);
  const [video, setVideo] = useState("");
  const handleMouseEnter = async () => {
    if (props.video) {
      setIsVideo(true);
      const response = await fetch(`src/assets/${props.video}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setVideo(blobUrl);
    }
  };

  return (
    <div className="work-image">
      <div
        className="work-image-in"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVideo(false)}
        data-cursor={"disable"}
      >
        <img src={props.image} alt={props.alt} />
        {isVideo && <video src={video} autoPlay muted playsInline loop></video>}
        
        <div className="work-links-container">
          {props.link && props.liveLink ? (
            <>
              <a 
                className="work-link github-btn" 
                href={props.link} 
                target="_blank" 
                rel="noopener noreferrer"
                title="View GitHub Repository"
              >
                <FaGithub />
              </a>
              <a 
                className="work-link live-btn" 
                href={props.liveLink} 
                target="_blank" 
                rel="noopener noreferrer"
                title="View Live Demo Website"
              >
                <FiGlobe />
              </a>
            </>
          ) : props.link ? (
            <a 
              className="work-link" 
              href={props.link} 
              target="_blank" 
              rel="noopener noreferrer"
              title="View Project Code"
            >
              <FaGithub />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default WorkImage;
