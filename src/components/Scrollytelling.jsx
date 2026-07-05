import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, Hourglass } from "lucide-react";
import GlassCard from "./ui/GlassCard";

gsap.registerPlugin(ScrollTrigger);

const scrollySections = [
  {
    title: "Beyond Limits",
    subtitle: "We're redefining the boundaries of deep tech innovation.",
    icon: Zap,
  },
  {
    title: "24 HOURS",
    subtitle: "Push your limits in an intense high-stakes environment.",
    icon: Hourglass,
  },
];


export default function Scrollytelling() {
  const containerRef = useRef(null);
  const sectionRefs = useRef([]);
  const badgeRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCompactScreen = window.innerWidth < 1024;

    if (prefersReducedMotion || isCompactScreen) {
      sectionRefs.current.forEach((section) => {
        if (section) {
          gsap.set(section, { autoAlpha: 1, y: 0, scale: 1 });
        }
      });
      return undefined;
    }

    const ctx = gsap.context(() => {
      // Badge fade in
      gsap.fromTo(
        badgeRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );

      // Stagger each section in/out
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=900",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      sectionRefs.current.forEach((section, index) => {
        if (!section) return;

        tl.to(
          section,
          { autoAlpha: 1, y: 0, scale: 1, duration: 1 },
          index * 2
        ).to(
          section,
          { autoAlpha: 0, y: -30, scale: 0.95, duration: 1 },
          index * 2 + 1.5
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen overflow-hidden"
    >
      {/* Grid + neon glows */}
      <div className="absolute inset-0 bg-grid-pattern" />
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(0,245,255,0.08) 0%, transparent 70%)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)" }} />

      {/* CRT scanline overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)" }} />

      <div className="relative z-10 h-screen max-w-4xl mx-auto px-4 pt-24 md:pt-28 pb-10 flex flex-col items-center justify-start text-center">


        <div className="relative w-full flex-1 min-h-0 flex items-start justify-center pt-4 md:pt-6">
          {scrollySections.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                ref={(el) => (sectionRefs.current[index] = el)}
                className="absolute inset-0 flex items-start justify-center px-1 sm:px-4"
                style={{ opacity: 0, visibility: "hidden", transform: "scale(0.9) translateY(24px)" }}
              >
                <GlassCard className="w-full max-w-3xl px-6 py-8 md:px-10 md:py-10">
                  {/* Top neon accent line */}
                  <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[var(--neon-cyan)] to-transparent opacity-40" />

                  <div className="relative">
                    <div
                      className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))", boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight font-mono">
                      {item.title}
                    </h2>
                    <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>
                </GlassCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
