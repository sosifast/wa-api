"use client";

import { useEffect, useRef, ElementType } from "react";
import { animate, splitText, stagger } from "animejs";

interface AnimatedTextProps {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
}

export default function AnimatedText({
  text,
  className = "",
  as: Component = "h1",
  delay = 0,
}: AnimatedTextProps) {
  const elRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!elRef.current) return;

    try {
      // Split by words to avoid mid-word line breaking
      const split = splitText(elRef.current, { words: true });
      if (split.words && split.words.length > 0) {
        animate(split.words, {
          opacity: [0, 1],
          y: [12, 0],
          delay: stagger(35, { start: delay }),
          duration: 400,
          ease: "outQuad",
        });
      }
    } catch {
      // Fallback
    }
  }, [text, delay]);

  return (
    <Component
      ref={elRef}
      className={`inline-block whitespace-normal break-normal ${className}`}
    >
      {text}
    </Component>
  );
}
