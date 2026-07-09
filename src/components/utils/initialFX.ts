import { SplitText } from "gsap/SplitText";
import gsap from "gsap";
import { smoother } from "../Navbar";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initialFX() {
  try {
    document.body.style.overflowY = "auto";
    if (smoother) {
      smoother.paused(false);
    }
    const mainEl = document.getElementsByTagName("main")[0];
    if (mainEl) {
      mainEl.classList.add("main-active");
    }
    gsap.to("body", {
      backgroundColor: "#0b080c",
      duration: 0.5,
      delay: 1,
    });

    // Recalculate ScrollTriggers once loader hides and height stabilizes
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1500);

    const targetElements = document.querySelectorAll(".landing-info h3, .landing-intro h2, .landing-intro h1");
    if (targetElements.length > 0) {
      const landingText = new SplitText(Array.from(targetElements), {
        type: "chars,lines",
        linesClass: "split-line",
      });
      if (landingText && landingText.chars && landingText.chars.length > 0) {
        gsap.fromTo(
          landingText.chars,
          { opacity: 0, y: 80, filter: "blur(5px)" },
          {
            opacity: 1,
            duration: 1.2,
            filter: "blur(0px)",
            ease: "power3.inOut",
            y: 0,
            stagger: 0.025,
            delay: 0.3,
          }
        );
      }
    }

    let TextProps = { type: "chars,lines", linesClass: "split-h2" };

    const h2Info = document.querySelector(".landing-h2-info");
    const h2Info1 = document.querySelector(".landing-h2-info-1");
    const h2_1 = document.querySelector(".landing-h2-1");
    const h2_2 = document.querySelector(".landing-h2-2");

    let landingText2, landingText3, landingText4, landingText5;

    if (h2Info) {
      landingText2 = new SplitText(h2Info, TextProps);
      if (landingText2 && landingText2.chars && landingText2.chars.length > 0) {
        gsap.fromTo(
          landingText2.chars,
          { opacity: 0, y: 80, filter: "blur(5px)" },
          {
            opacity: 1,
            duration: 1.2,
            filter: "blur(0px)",
            ease: "power3.inOut",
            y: 0,
            stagger: 0.025,
            delay: 0.3,
          }
        );
      }
    }

    gsap.fromTo(
      ".landing-info-h2",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        duration: 1.2,
        ease: "power1.inOut",
        y: 0,
        delay: 0.8,
      }
    );

    gsap.fromTo(
      [".header", ".icons-section", ".nav-fade"],
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.2,
        ease: "power1.inOut",
        delay: 0.1,
      }
    );

    if (h2Info1) landingText3 = new SplitText(h2Info1, TextProps);
    if (h2_1) landingText4 = new SplitText(h2_1, TextProps);
    if (h2_2) landingText5 = new SplitText(h2_2, TextProps);

    if (landingText2 && landingText3) LoopText(landingText2, landingText3);
    if (landingText4 && landingText5) LoopText(landingText4, landingText5);

  } catch (error) {
    console.error("Error in initialFX:", error);
    document.body.style.overflowY = "auto";
    if (smoother) {
      smoother.paused(false);
    }
    ScrollTrigger.refresh();
  }
}

function LoopText(Text1: SplitText, Text2: SplitText) {
  if (!Text1 || !Text2 || !Text1.chars || !Text2.chars || Text1.chars.length === 0 || Text2.chars.length === 0) {
    return;
  }
  var tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
  const delay = 4;
  const delay2 = delay * 2 + 1;

  tl.fromTo(
    Text2.chars,
    { opacity: 0, y: 80 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power3.inOut",
      y: 0,
      stagger: 0.1,
      delay: delay,
    },
    0
  )
    .fromTo(
      Text1.chars,
      { y: 80 },
      {
        duration: 1.2,
        ease: "power3.inOut",
        y: 0,
        stagger: 0.1,
        delay: delay2,
      },
      1
    )
    .fromTo(
      Text1.chars,
      { y: 0 },
      {
        y: -80,
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.1,
        delay: delay,
      },
      0
    )
    .to(
      Text2.chars,
      {
        y: -80,
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.1,
        delay: delay2,
      },
      1
    );
}
