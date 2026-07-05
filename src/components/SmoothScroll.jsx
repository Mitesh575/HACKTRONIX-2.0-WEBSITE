import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });

    lenisRef.current = lenis;
    // Expose globally so SingularityOverlay can freeze/restore scroll
    window.__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    rafRef.current = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(rafRef.current);

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      if (rafRef.current) {
        gsap.ticker.remove(rafRef.current);
      }
    };
  }, []);

  return <>{children}</>;
}
