import { useEffect, useRef, useState, useCallback } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import "./styles/Navbar.css";
import { useLoading } from "../context/LoadingProvider";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

type NavTab = {
  id: string;
  label: string;
  href: string;
};

const navTabs: NavTab[] = [
  { id: "about", label: "About", href: "#about" },
  { id: "career", label: "Experience", href: "#career" },
  { id: "work", label: "Work", href: "#work" },
  { id: "techstack", label: "Tech Stack", href: "#techstack" },
  { id: "github-heatmap", label: "GitHub Heatmap", href: "#github-heatmap" },
  { id: "askyash", label: "ask yash.exe", href: "#askyash" },
  { id: "opento", label: "Open To Work", href: "#opento" },
  { id: "contact", label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const { isLoading } = useLoading();
  const [activeTab, setActiveTab] = useState<string>("");

  const [isDesktopView, setIsDesktopView] = useState<boolean>(window.innerWidth > 1024);

  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);
  const tabRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  // Flag to prevent ScrollTrigger from fighting click transitions
  const isClickingRef = useRef<boolean>(false);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Animate the active white pill with signature bouncy elastic physics
  const animatePillToTab = useCallback((tabId: string | null, isInstant: boolean = false) => {
    const pill = pillRef.current;
    if (!pill) return;

    if (!tabId || !tabRefs.current[tabId]) {
      if (isInstant) {
        gsap.set(pill, { opacity: 0 });
      } else {
        gsap.to(pill, {
          opacity: 0,
          scale: 0.85,
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
      return;
    }

    const nav = navRef.current;
    const tab = tabRefs.current[tabId];
    if (!nav || !tab) return;

    const navRect = nav.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();

    const x = tabRect.left - navRect.left;
    const y = tabRect.top - navRect.top;
    const width = tabRect.width;
    const height = tabRect.height;

    const currentOpacity = gsap.getProperty(pill, "opacity") as number;

    if (isInstant) {
      gsap.set(pill, {
        x,
        y,
        width,
        height,
        scale: 1,
        opacity: 1,
      });
    } else if (currentOpacity === 0) {
      // If pill was hidden, position it at the tab first and spring scale/fade in
      gsap.set(pill, { x, y, width, height, scale: 0.85 });
      gsap.to(pill, {
        opacity: 1,
        scale: 1,
        duration: 0.38,
        ease: "back.out(1.8)",
        overwrite: "auto",
      });
    } else {
      // Sasha Martynchuk signature spring ease with overshoot and elastic settle
      gsap.to(pill, {
        x,
        y,
        width,
        height,
        scale: 1,
        opacity: 1,
        duration: 0.52,
        ease: "back.out(1.65)",
        overwrite: "auto",
      });
    }
  }, []);

  // Ghost hover pill tracks inactive hovered tab
  const handleTabMouseEnter = useCallback((tabId: string) => {
    if (tabId === activeTab) {
      if (ghostRef.current) {
        gsap.to(ghostRef.current, { opacity: 0, duration: 0.2 });
      }
      return;
    }

    const nav = navRef.current;
    const ghost = ghostRef.current;
    const tab = tabRefs.current[tabId];
    if (!nav || !ghost || !tab) return;

    const navRect = nav.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();

    const x = tabRect.left - navRect.left;
    const y = tabRect.top - navRect.top;
    const width = tabRect.width;
    const height = tabRect.height;

    gsap.to(ghost, {
      x,
      y,
      width,
      height,
      opacity: 1,
      duration: 0.28,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, [activeTab]);

  const handleNavMouseLeave = useCallback(() => {
    if (ghostRef.current) {
      gsap.to(ghostRef.current, {
        opacity: 0,
        duration: 0.22,
        ease: "power2.out",
      });
    }
  }, []);

  // Handle Tab Click
  const handleTabClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    tabId: string,
    href: string
  ) => {
    e.preventDefault();

    isClickingRef.current = true;
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => {
      isClickingRef.current = false;
    }, 1000);

    setActiveTab(tabId);
    animatePillToTab(tabId, false);

    if (ghostRef.current) {
      gsap.to(ghostRef.current, { opacity: 0, duration: 0.2 });
    }

    if (window.innerWidth > 1024 && smoother) {
      smoother.scrollTo(href, true, "top top");
    } else {
      const targetElement = document.querySelector(href);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // ScrollSmoother setup — must run ONCE on mount only.
  // It resets the scroll position to the top, so re-running it on every
  // activeTab/isLoading change would yank the user back to the landing
  // section the moment the scrollspy updated the active tab.
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
      // Respect current loading state — StrictMode remounts after loading can
      // leave scroll locked if we always pause here while isLoading is false.
      smoother.paused(isLoading);
    }

    return () => {
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  // Keep ScrollTrigger measurements and the nav pill in sync on resize
  useEffect(() => {
    const handleResize = () => {
      setIsDesktopView(window.innerWidth > 1024);
      if (window.innerWidth > 1024 && smoother) {
        ScrollSmoother.refresh(true);
      }
      if (activeTab && tabRefs.current[activeTab]) {
        animatePillToTab(activeTab, true);
      } else {
        animatePillToTab(null, true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [activeTab, animatePillToTab]);

  useEffect(() => {
    if (window.innerWidth > 1024 && smoother) {
      smoother.paused(isLoading);
      if (!isLoading) {
        ScrollSmoother.refresh(true);
      }
    }
    if (!isLoading) {
      // Safety net: index.css ships `body { overflow: hidden }` for the loader,
      // so the page stays unscrollable until something opens it back up.
      // ScrollSmoother needs the native window scroll, so this applies on
      // desktop too - not just the native-scroll (<=1024px) path.
      document.body.style.overflowY = "auto";
      document.body.style.overflowX = "hidden";
    }
    ScrollTrigger.refresh();
  }, [isLoading]);

  // Initial pill positioning: hide pill on start (since user begins at Hero)
  useEffect(() => {
    animatePillToTab(null, true);
  }, [animatePillToTab]);

  // ScrollSpy with ScrollTrigger to update active tab on scroll
  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    // Hero trigger: when in Hero (#landingDiv), clear active tab & hide pill
    const landingEl = document.querySelector("#landingDiv");
    if (landingEl) {
      const landingTrigger = ScrollTrigger.create({
        trigger: landingEl,
        start: "top top",
        end: "bottom 50%",
        onEnter: () => {
          if (!isClickingRef.current) {
            setActiveTab("");
            animatePillToTab(null, false);
          }
        },
        onEnterBack: () => {
          if (!isClickingRef.current) {
            setActiveTab("");
            animatePillToTab(null, false);
          }
        },
      });
      triggers.push(landingTrigger);
    }

    // Section triggers for About, Experience, Work, TechStack, GitHub Heatmap, askyash, Open To Work, Contact
    const sectionConfigs = [
      { id: "about", selector: "#about", endTrigger: "#career", start: "top 50%", end: "top 50%" },
      { id: "career", selector: "#career", endTrigger: "#work", start: "top 50%", end: "top 50%" },
      { id: "work", selector: "#work", endTrigger: isDesktopView ? "#techstack" : "#github-heatmap", start: "top 50%", end: "top 50%" },
      ...(isDesktopView ? [{ id: "techstack", selector: "#techstack", endTrigger: "#github-heatmap", start: "top 50%", end: "top 50%" }] : []),
      { id: "github-heatmap", selector: "#github-heatmap", endTrigger: "#askyash", start: "top 50%", end: "top 50%" },
      { id: "askyash", selector: "#askyash", endTrigger: "#opento", start: "top 50%", end: "top 50%" },
      { id: "opento", selector: "#opento", endTrigger: "#contact", start: "top 50%", end: "top 85%" },
      { id: "contact", selector: "#contact", endTrigger: undefined, start: "top 85%", end: "bottom bottom" },
    ];

    sectionConfigs.forEach(({ id, selector, endTrigger, start, end }) => {
      const el = document.querySelector(selector);
      if (!el) return;

      const trigger = ScrollTrigger.create({
        trigger: el,
        endTrigger: endTrigger ? document.querySelector(endTrigger) || undefined : undefined,
        start,
        end,
        onEnter: () => {
          if (!isClickingRef.current) {
            setActiveTab(id);
            animatePillToTab(id, false);
          }
        },
        onEnterBack: () => {
          if (!isClickingRef.current) {
            setActiveTab(id);
            animatePillToTab(id, false);
          }
        },
      });

      triggers.push(trigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [animatePillToTab, isDesktopView]);



  return (
    <>
      <header className="header">
        {/* Floating Bouncy Capsule Nav Dock */}
        <nav
          className="bouncy-nav-dock"
          ref={navRef}
          onMouseLeave={handleNavMouseLeave}
          aria-label="Portfolio Sections"
        >
          {/* Subtle Ghost Hover Highlight */}
          <span
            className="bouncy-nav-ghost"
            ref={ghostRef}
            aria-hidden="true"
          />

          {/* Active Spring Bouncy Pill */}
          <span
            className="bouncy-nav-pill"
            ref={pillRef}
            aria-hidden="true"
          />

          {navTabs
            .filter((tab) => isDesktopView || tab.id !== "techstack")
            .map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <a
                key={tab.id}
                href={tab.href}
                ref={(el) => (tabRefs.current[tab.id] = el)}
                className={`bouncy-nav-item ${isActive ? "is-active" : ""}`}
                onClick={(e) => handleTabClick(e, tab.id, tab.href)}
                onMouseEnter={() => handleTabMouseEnter(tab.id)}
                data-cursor="disable"
              >
                <span className="bouncy-nav-label">{tab.label}</span>
              </a>
            );
          })}
        </nav>
      </header>

      <div className="nav-fade" />
    </>
  );
};

export default Navbar;
