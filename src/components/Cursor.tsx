import { useEffect, useRef } from "react";
import "./styles/Cursor.css";
import gsap from "gsap";

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let hover = false;
    const cursor = cursorRef.current!;

    // 1. Initialize quickTo setters for x and y positioning
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power2.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power2.out" });

    // 2. Optimized mousemove handler using quickTo
    const onMouseMove = (e: MouseEvent) => {
      if (!hover) {
        xTo(e.clientX);
        yTo(e.clientY);
      }
    };
    document.addEventListener("mousemove", onMouseMove);

    // 3. Register cursor modifiers on interactive elements
    const hoverElements = document.querySelectorAll("[data-cursor]");
    const enterListeners: ((e: MouseEvent) => void)[] = [];
    const leaveListeners: (() => void)[] = [];

    hoverElements.forEach((item, index) => {
      const element = item as HTMLElement;
      
      const onMouseOver = (e: MouseEvent) => {
        const target = e.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();

        if (element.dataset.cursor === "icons") {
          cursor.classList.add("cursor-icons");
          xTo(rect.left);
          yTo(rect.top);
          cursor.style.setProperty("--cursorH", `${rect.height}px`);
          hover = true;
        }
        if (element.dataset.cursor === "disable") {
          cursor.classList.add("cursor-disable");
        }
      };

      const onMouseOut = () => {
        cursor.classList.remove("cursor-disable", "cursor-icons");
        hover = false;
      };

      element.addEventListener("mouseover", onMouseOver);
      element.addEventListener("mouseout", onMouseOut);

      enterListeners[index] = onMouseOver;
      leaveListeners[index] = onMouseOut;
    });

    // 4. Memory Leak Cleanup
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      hoverElements.forEach((item, index) => {
        const element = item as HTMLElement;
        element.removeEventListener("mouseover", enterListeners[index]);
        element.removeEventListener("mouseout", leaveListeners[index]);
      });
    };
  }, []);

  return <div className="cursor-main" ref={cursorRef}></div>;
};

export default Cursor;
