import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  const dotX = useSpring(mouseX, { damping: 28, stiffness: 600 });
  const dotY = useSpring(mouseY, { damping: 28, stiffness: 600 });
  const ringX = useSpring(mouseX, { damping: 38, stiffness: 220 });
  const ringY = useSpring(mouseY, { damping: 38, stiffness: 220 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const onEnterClickable = () => setIsHovering(true);
    const onLeaveClickable = () => setIsHovering(false);

    window.addEventListener("mousemove", move);

    const attachListeners = () => {
      const targets = document.querySelectorAll<HTMLElement>(
        "a, button, [role='button'], .cursor-pointer, input, textarea, select"
      );
      targets.forEach((el) => {
        el.addEventListener("mouseenter", onEnterClickable);
        el.addEventListener("mouseleave", onLeaveClickable);
      });
    };

    attachListeners();

    const observer = new MutationObserver(attachListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", move);
      observer.disconnect();
    };
  }, [mouseX, mouseY, isVisible]);

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
          width: isHovering ? 10 : 6,
          height: isHovering ? 10 : 6,
          backgroundColor: "hsl(38 75% 52%)",
          opacity: isVisible ? 1 : 0,
          transition: "width 0.2s, height 0.2s",
        }}
      />
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border hidden md:block"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          width: isHovering ? 44 : 28,
          height: isHovering ? 44 : 28,
          borderColor: isHovering ? "hsl(340 45% 40% / 0.5)" : "hsl(38 75% 52% / 0.35)",
          backgroundColor: isHovering ? "hsl(340 45% 40% / 0.06)" : "transparent",
          opacity: isVisible ? 1 : 0,
          transition: "width 0.25s ease, height 0.25s ease, border-color 0.25s, background-color 0.25s",
        }}
      />
    </>
  );
}
