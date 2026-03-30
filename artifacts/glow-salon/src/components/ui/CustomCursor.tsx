import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

type CursorState = "default" | "hover" | "text" | "click";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function CustomCursor() {
  const [cursorState, setCursorState] = useState<CursorState>("default");
  const [isVisible, setIsVisible] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const mouseX = useMotionValue(-300);
  const mouseY = useMotionValue(-300);

  // Dot tracks cursor tightly
  const dotX = useSpring(mouseX, { damping: 32, stiffness: 900, mass: 0.3 });
  const dotY = useSpring(mouseY, { damping: 32, stiffness: 900, mass: 0.3 });

  // Ring trails behind with a smooth lag
  const ringX = useSpring(mouseX, { damping: 40, stiffness: 180, mass: 0.6 });
  const ringY = useSpring(mouseY, { damping: 40, stiffness: 180, mass: 0.6 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const onClick = (e: MouseEvent) => {
      // Spawn a ripple at click position
      const id = Date.now() + Math.random();
      setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700);

      // Brief shrink then restore
      setCursorState("click");
      setTimeout(() => {
        const t = (e.target as HTMLElement)?.closest(
          "a, button, [role='button'], .cursor-pointer, input, textarea, select, label"
        );
        setCursorState(t ? "hover" : "default");
      }, 180);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest(
        "a, button, [role='button'], .cursor-pointer, input, textarea, select, label, [tabindex]"
      );
      const text = !clickable && target.closest("p, h1, h2, h3, h4, h5, h6, span, li, blockquote");

      if (clickable) setCursorState("hover");
      else if (text) setCursorState("text");
      else setCursorState("default");
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("click", onClick);
    document.addEventListener("mouseover", onMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      document.removeEventListener("mouseover", onMouseOver);
    };
  }, [mouseX, mouseY, isVisible]);

  // Derived style values per state
  const dotSize =
    cursorState === "click" ? 3 : cursorState === "hover" ? 9 : cursorState === "text" ? 2 : 6;

  const ringSize =
    cursorState === "click" ? 18 : cursorState === "hover" ? 50 : cursorState === "text" ? 22 : 34;

  const dotColor =
    cursorState === "hover" || cursorState === "click"
      ? "hsl(340 45% 42%)"
      : "hsl(38 75% 50%)";

  const ringBorder =
    cursorState === "hover"
      ? "1.5px solid hsl(340 45% 42% / 0.55)"
      : cursorState === "text"
      ? "1px solid hsl(38 75% 50% / 0.25)"
      : cursorState === "click"
      ? "1px solid hsl(340 45% 42% / 0.8)"
      : "1px solid hsl(38 75% 50% / 0.45)";

  const ringBg =
    cursorState === "hover"
      ? "hsl(340 45% 42% / 0.06)"
      : cursorState === "click"
      ? "hsl(340 45% 42% / 0.12)"
      : "transparent";

  const ringOpacity =
    cursorState === "text" ? 0.45 : isVisible ? 1 : 0;

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null; // touch devices
  }

  return (
    <>
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full hidden md:block"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          width: dotSize,
          height: dotSize,
          backgroundColor: dotColor,
          opacity: isVisible ? 1 : 0,
          transition: "width 0.15s ease, height 0.15s ease, background-color 0.18s ease, opacity 0.3s",
        }}
      />

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full hidden md:block"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          width: ringSize,
          height: ringSize,
          border: ringBorder,
          backgroundColor: ringBg,
          opacity: ringOpacity,
          transition:
            "width 0.22s cubic-bezier(.25,.8,.25,1), height 0.22s cubic-bezier(.25,.8,.25,1), border 0.2s ease, background-color 0.2s ease, opacity 0.3s",
        }}
      />

      {/* Click ripples */}
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.div
            key={r.id}
            className="fixed top-0 left-0 pointer-events-none z-[9997] rounded-full hidden md:block"
            initial={{
              x: r.x,
              y: r.y,
              translateX: "-50%",
              translateY: "-50%",
              width: 10,
              height: 10,
              opacity: 0.7,
              border: "1px solid hsl(38 75% 50% / 0.8)",
              backgroundColor: "hsl(38 75% 50% / 0.12)",
            }}
            animate={{ width: 72, height: 72, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        ))}
      </AnimatePresence>
    </>
  );
}
