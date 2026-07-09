import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import "./styles/Navbar.css";
import { useLoading } from "../context/LoadingProvider";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

const Navbar = () => {
  const { isLoading } = useLoading();

  useEffect(() => {
    if (window.innerWidth > 1024) {
      smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.5,
        speed: 1.2,
        smoothTouch: 0.1,
        effects: true,
        autoResize: true,
        ignoreMobileResize: true,
      });

      smoother.scrollTop(0);
      smoother.paused(isLoading);
    }

    let links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      let element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          let elem = e.currentTarget as HTMLAnchorElement;
          let section = elem.getAttribute("data-href");
          if (smoother) {
            smoother.scrollTo(section, true, "top top");
          }
        }
      });
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1024) {
        ScrollSmoother.refresh(true);
      }
    });
  }, []);

  useEffect(() => {
    if (window.innerWidth > 1024 && smoother) {
      smoother.paused(isLoading);
      ScrollTrigger.refresh();
    }
  }, [isLoading]);
  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          YRS
        </a>
        <a
          href="mailto:yashraj10messi@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          yashraj10messi@gmail.com
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
