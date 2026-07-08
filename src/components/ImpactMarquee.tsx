import "./styles/ImpactMarquee.css";

const impactItems = [
  "Building Intelligent Systems",
  "Fine-Tuning LLMs",
  "Shipping Production AI",
  "Full-Stack Engineering",
  "Always Learning",
];

const ImpactMarquee = () => {
  return (
    <div className="impact-marquee-section">
      <div className="impact-marquee-container">
        {/* We render the track twice for seamless infinite scrolling */}
        <div className="impact-marquee-track">
          {impactItems.map((item, index) => (
            <div className="impact-item" key={`first-${index}`}>
              <span className="impact-text">{item}</span>
              <span className="impact-star">✦</span>
            </div>
          ))}
          {impactItems.map((item, index) => (
            <div className="impact-item" key={`second-${index}`}>
              <span className="impact-text">{item}</span>
              <span className="impact-star">✦</span>
            </div>
          ))}
          {impactItems.map((item, index) => (
            <div className="impact-item" key={`third-${index}`}>
              <span className="impact-text">{item}</span>
              <span className="impact-star">✦</span>
            </div>
          ))}
          {impactItems.map((item, index) => (
            <div className="impact-item" key={`fourth-${index}`}>
              <span className="impact-text">{item}</span>
              <span className="impact-star">✦</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImpactMarquee;
