import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MatrixText } from "./MatrixText";
import bgNormal from "../images/bg-normal.jpeg";
import bgHover from "../images/bg-hover.jpeg";
import ProblemStatementPdf from "../images/HackTronix2_0_ProblemStatements.pdf.pdf";
import { useSingularityTransition } from "./singularity-transition/engine/useSingularityTransition";


gsap.registerPlugin(ScrollTrigger);

const EVENT_DATE = new Date("2026-08-06T09:00:00");

function useCountdown(targetDate) {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return countdown;
}

function CountdownItem({ value, label, variant = "white" }) {
  const isWhite = variant === "white";
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center"
    >
      <div className="relative">
        <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center border overflow-hidden ${isWhite ? "bg-white/10 border-white/20" : "bg-black/10 border-black/20"
          }`}>
          <span className={`text-2xl md:text-3xl font-bold font-mono counter-value ${isWhite ? "text-white" : "text-black"
            }`}>
            {String(value).padStart(2, "0")}
          </span>
          {/* Corner accents */}
          <div className={`absolute top-0 left-0 w-3 h-3 border-t border-l opacity-60 ${isWhite ? "border-white" : "border-black"}`} />
          <div className={`absolute top-0 right-0 w-3 h-3 border-t border-r opacity-60 ${isWhite ? "border-white" : "border-black"}`} />
          <div className={`absolute bottom-0 left-0 w-3 h-3 border-b border-l opacity-60 ${isWhite ? "border-white" : "border-black"}`} />
          <div className={`absolute bottom-0 right-0 w-3 h-3 border-b border-r opacity-60 ${isWhite ? "border-white" : "border-black"}`} />
        </div>
        <div className={`absolute -inset-1 rounded-xl blur opacity-10 ${isWhite ? "bg-white" : "bg-black"
          }`} />
      </div>
      <span className={`mt-3 text-[10px] font-mono uppercase tracking-[0.2em] ${isWhite ? "text-white/70" : "text-black/70"
        }`}>{label}</span>
    </motion.div>
  );
}


function FloatingOrb({ className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2, delay, repeat: Infinity, repeatType: "reverse" }}
      className={`absolute rounded-full blur-3xl ${className}`}
    />
  );
}

export default function Hero() {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { bind: transitionBind } = useSingularityTransition({ destination: "/external-registration" });

  const countdown = useCountdown(EVENT_DATE);
  const containerRef = useRef(null);
  const frameRef = useRef(null);
  const mobileTitleRef = useRef(null);
  const desktopLeftRef = useRef(null);
  const desktopRightRef = useRef(null);
  const disableTitleScrollMotion = true;

  useGSAP(() => {
    const slot = document.getElementById("nav-logo-slot");
    if (!slot) return;

    const mm = gsap.matchMedia();

    mm.add("(max-width: 767px)", () => {
      const mobileTitle = mobileTitleRef.current;
      if (!mobileTitle) return;
      if (disableTitleScrollMotion) return;

      gsap.set(mobileTitle, { transformOrigin: "left center", zIndex: 80, position: "relative" });

      const getMobileMetrics = () => {
        const titleRect = mobileTitle.getBoundingClientRect();
        const slotRect = slot.getBoundingClientRect();
        const targetFontSize = 22;
        const sourceFontSize = parseFloat(window.getComputedStyle(mobileTitle).fontSize) || 64;
        const scale = targetFontSize / sourceFontSize;
        const targetLeft = slotRect.right + 80;
        const targetCenterY = slotRect.top + slotRect.height / 2;

        return {
          x: targetLeft - titleRect.left,
          y: targetCenterY - (titleRect.top + titleRect.height / 2),
          scale,
        };
      };

      gsap.to(mobileTitle, {
        x: () => getMobileMetrics().x,
        y: () => getMobileMetrics().y,
        scale: () => getMobileMetrics().scale,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=780",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });

    mm.add("(min-width: 768px)", () => {
      const desktopLeft = desktopLeftRef.current;
      const desktopRight = desktopRightRef.current;
      if (!desktopLeft || !desktopRight) return;
      if (disableTitleScrollMotion) return;

      gsap.set([desktopLeft, desktopRight], {
        transformOrigin: "left center",
        zIndex: 80,
        position: "relative",
      });

      const getDesktopMetrics = () => {
        const leftRect = desktopLeft.getBoundingClientRect();
        const rightRect = desktopRight.getBoundingClientRect();
        const slotRect = slot.getBoundingClientRect();
        const targetFontSize = 24;

        const leftSourceFont = parseFloat(window.getComputedStyle(desktopLeft).fontSize) || 96;
        const rightSourceFont = parseFloat(window.getComputedStyle(desktopRight).fontSize) || 96;

        const leftScale = targetFontSize / leftSourceFont;
        const rightScale = targetFontSize / rightSourceFont;

        const targetLeftBase = slotRect.right + 80;
        const targetCenterY = slotRect.top + slotRect.height / 2;

        const leftTargetLeft = targetLeftBase;
        const rightTargetLeft = leftTargetLeft + leftRect.width * leftScale - 2;

        return {
          leftX: leftTargetLeft - leftRect.left,
          leftY: targetCenterY - (leftRect.top + leftRect.height / 2),
          leftScale,
          rightX: rightTargetLeft - rightRect.left,
          rightY: targetCenterY - (rightRect.top + rightRect.height / 2),
          rightScale,
        };
      };

      gsap.to(desktopLeft, {
        x: () => getDesktopMetrics().leftX,
        y: () => getDesktopMetrics().leftY,
        scale: () => getDesktopMetrics().leftScale,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=780",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      gsap.to(desktopRight, {
        x: () => getDesktopMetrics().rightX,
        y: () => getDesktopMetrics().rightY,
        scale: () => getDesktopMetrics().rightScale,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=780",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => mm.revert();
  }, { scope: containerRef });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current || frameRef.current) return;

      frameRef.current = requestAnimationFrame(() => {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        containerRef.current?.style.setProperty("--mouse-x", `${x}%`);
        containerRef.current?.style.setProperty("--mouse-y", `${y}%`);
        frameRef.current = null;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <section
      id="home"
      ref={containerRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ "--mouse-x": "50%", "--mouse-y": "50%" }}
    >
      {/* BACKGROUNDS */}

      {/* Desktop Only: Background Image Layers with Smooth Transition */}
      <div
        className="hidden md:block absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgNormal})`,
          maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)"
        }}
      />
      <div
        className="hidden md:block absolute inset-0 -z-10 bg-cover bg-center transition-opacity duration-700 ease-in-out"
        style={{
          backgroundImage: `url(${bgHover})`,
          opacity: isHovered ? 1 : 0,
          maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)"
        }}
      />

      {/* Mobile Only: Original Grid and Orbs */}
      <div className="md:hidden absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />
      <div className="md:hidden">
        <FloatingOrb className="w-96 h-96 bg-primary/10 -top-48 -left-48" delay={0} />
        <FloatingOrb className="w-80 h-80 bg-secondary/8 top-1/2 right-0" delay={0.5} />
        <FloatingOrb className="w-64 h-64 bg-accent/8 bottom-0 left-1/3" delay={1} />
      </div>

      {/* Shared/Desktop View: Desktop Orbs */}
      <div className="hidden md:block">
        <FloatingOrb className="w-96 h-96 bg-blue-600/10 -top-48 -left-48" delay={0} />
        <FloatingOrb className="w-80 h-80 bg-red-600/10 top-1/2 right-0" delay={0.5} />
        <FloatingOrb className="w-64 h-64 bg-orange-600/10 bottom-0 left-1/4" delay={1} />
      </div>

      {/* Desktop Grid (Lighter) */}
      <div className="hidden md:block absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      {/* Radial Gradient Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(99, 102, 241, 0.05) 0%, transparent 50%)`
        }}
      />

      {/* CONTENT WRAPPER */}
      <div className="w-full h-full relative z-10 flex flex-col items-center justify-center">

        {/* MOBILE VIEW (CENTERED) */}
        <div className="md:hidden max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
            data-collapse
          >
            <span className="section-badge border-glow-cyan text-[10px]">
              <span className="w-1 h-1 rounded-full bg-[var(--neon-cyan)] animate-pulse" />
              <span className="font-mono">REGISTRATION OPEN</span>
            </span>
          </motion.div>

          <h1 ref={mobileTitleRef} className="text-4xl sm:text-5xl font-extrabold text-white mb-6 tracking-wider crt-flicker" style={{ fontFamily: "'Star Jedi', sans-serif" }} data-collapse>
            HackTronix <span className="text-[var(--neon-cyan)]">2.0</span>
          </h1>

          <p className="text-base text-gray-400 mb-10 max-w-sm mx-auto leading-relaxed" data-collapse>
            A 24-hour hackathon exploring the upside-down world of technology
          </p>

          <div className="flex flex-col gap-4 mb-12" data-collapse>
            <button
              onClick={() => navigate('/internal-registration')}
              className="btn-sw-primary py-3"
            >
              <span>Internal Registration</span>
            </button>
            <button
              {...transitionBind}
              className="btn-sw-secondary py-3 font-mono text-sm uppercase"
            >
              External Registration
            </button>
          </div>

          <div className="flex justify-center gap-4" data-collapse>
            <CountdownItem value={countdown.days} label="Days" />
            <CountdownItem value={countdown.hours} label="Hours" />
            <CountdownItem value={countdown.minutes} label="Min" />
            <CountdownItem value={countdown.seconds} label="Sec" />
          </div>
        </div>

        {/* DESKTOP VIEW (SPLIT) */}
        <div className="hidden md:flex w-full h-full flex-row">
          {/* Left Side: Light Theme */}
          <div
            className="w-1/2 flex flex-col items-end justify-center pr-4 text-right transition-all duration-500"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-end"
              data-collapse
            >
              <h1 ref={desktopLeftRef} className="text-8xl text-white tracking-[0.1em] mb-4" style={{ fontFamily: "'Star Jedi', sans-serif" }}>
                HackTr
              </h1>
              <p className="text-xl text-white/80 mb-10 max-w-md font-medium">
                A 24-hour hackathon exploring the
              </p>
              <button
                onClick={() => navigate('/internal-registration')}
                className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-white/90 transition-all mb-12 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                Internal Registration
              </button>
              <div className="flex gap-8">
                <CountdownItem value={countdown.days} label="Days" variant="white" />
                <CountdownItem value={countdown.hours} label="Hours" variant="white" />
              </div>
            </motion.div>
          </div>

          {/* Right Side: Dark Theme */}
          <div
            className="w-1/2 flex flex-col items-start justify-center pl-4 text-left transition-all duration-500"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-start"
              data-collapse
            >
              <h1 ref={desktopRightRef} className="text-8xl text-black tracking-[0.1em] mb-4" style={{ fontFamily: "'Star Jedi', sans-serif" }}>
                onix 2.0
              </h1>
              <p className="text-xl text-black/80 mb-10 max-w-md font-medium">
                upside-down world of technology
              </p>
              <button
                {...transitionBind}
                className="inline-block px-8 py-4 bg-black text-white font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-black/90 transition-all mb-12 shadow-[0_0_20px_rgba(0,0,0,0.2)] border border-white/10"
              >
                External Registration
              </button>
              <div className="flex gap-8">
                <CountdownItem value={countdown.minutes} label="Minutes" variant="black" />
                <CountdownItem value={countdown.seconds} label="Seconds" variant="black" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>



      {/* Bottom Fade Removed to prevent shade over background character */}
    </section>
  );
}
