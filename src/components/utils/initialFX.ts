import { SplitText } from "gsap/SplitText";
import gsap from "gsap";
import { smoother } from "../Navbar";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger, SplitText);

export function initialFX() {
  try {
    // The body must stay vertically scrollable on BOTH mobile and desktop.
    document.body.style.overflowX = "hidden";
    document.body.style.overflowY = "auto";

    const sm = ScrollSmoother.get() || smoother;
    if (sm) {
      sm.paused(false);
      ScrollSmoother.refresh(true);
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

    const targetElements = document.querySelectorAll(
      ".landing-info h3, .landing-intro h2, .landing-intro h1"
    );
    if (targetElements.length > 0) {
      const landingText = new SplitText(Array.from(targetElements), {
        type: "chars,lines",
        linesClass: "split-line",
      });
      if (landingText && landingText.chars && landingText.chars.length > 0) {
        gsap.fromTo(
          landingText.chars,
          { opacity: 0, y: 50, filter: "blur(4px)" },
          {
            opacity: 1,
            duration: 1,
            filter: "blur(0px)",
            ease: "power3.out",
            y: 0,
            stagger: 0.02,
            delay: 0.2,
          }
        );
      }
    }

    // Role rotator entrance animation
    gsap.fromTo(
      ".role-rotator",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        delay: 0.5,
      }
    );

    gsap.fromTo(
      [".header", ".icons-section", ".nav-fade"],
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        ease: "power1.inOut",
        delay: 0.1,
      }
    );

  } catch (error) {
    console.error("Error in initialFX:", error);
    // Never leave the page unscrollable if the intro animation blew up.
    document.body.style.overflowX = "hidden";
    document.body.style.overflowY = "auto";
    const sm = ScrollSmoother.get() || smoother;
    if (sm) {
      sm.paused(false);
      ScrollSmoother.refresh(true);
    }
    ScrollTrigger.refresh();
  }
}
