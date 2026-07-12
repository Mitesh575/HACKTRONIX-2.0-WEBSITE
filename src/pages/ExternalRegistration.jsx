import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Swords,
  Crosshair,
  Orbit,
  Satellite,
  Radar,
  Terminal,
  Bot,
  Zap,
  Aperture,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import TargetCursor from "../components/TargetCursor";
import RegistrationModal from "../components/RegistrationModal";

/* ── Animated starfield canvas ── */
function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let stars = [];
    const STAR_COUNT = 280;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create stars
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.8 + 0.3,
        speed: Math.random() * 0.4 + 0.05,
        opacity: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    const draw = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((s) => {
        s.y += s.speed;
        if (s.y > canvas.height) {
          s.y = 0;
          s.x = Math.random() * canvas.width;
        }
        const twinkle =
          0.5 + 0.5 * Math.sin(time * s.twinkleSpeed + s.twinklePhase);
        const alpha = s.opacity * twinkle;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${alpha})`;
        ctx.fill();

        // Glow for brighter stars
        if (s.size > 1.2) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 245, 255, ${alpha * 0.08})`;
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

/* ── Holographic scan line effect ── */
function HoloScanlines() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,245,255,0.015) 2px, rgba(0,245,255,0.015) 4px)",
        }}
      />
      <motion.div
        className="absolute left-0 right-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0,245,255,0.3) 20%, rgba(0,245,255,0.5) 50%, rgba(0,245,255,0.3) 80%, transparent 100%)",
          boxShadow: "0 0 20px rgba(0,245,255,0.3), 0 0 60px rgba(0,245,255,0.1)",
        }}
        animate={{ top: ["-5%", "105%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

/* ── Typing text effect ── */
function TypingText({ text, delay = 0, className = "" }) {
  const [displayed, setDisplayed] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let timeout;
    let i = 0;
    const startTimeout = setTimeout(() => {
      const type = () => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
          timeout = setTimeout(type, 40 + Math.random() * 30);
        } else {
          setTimeout(() => setShowCursor(false), 1500);
        }
      };
      type();
    }, delay);
    return () => {
      clearTimeout(startTimeout);
      clearTimeout(timeout);
    };
  }, [text, delay]);

  return (
    <span className={className}>
      {displayed}
      {showCursor && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
          className="text-[var(--neon-cyan)]"
        >
          ▌
        </motion.span>
      )}
    </span>
  );
}

/* ── Perk card with image ── */
function PerkCard({ icon: Icon, title, description, gradient, image, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      whileHover={{ y: -10, scale: 1.03 }}
      className="group relative cursor-target"
    >
      {/* Outer glow on hover */}
      <div
        className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
        style={{
          background: `linear-gradient(135deg, var(--neon-cyan), var(--color-primary))`,
        }}
      />
      <div className="relative rounded-xl overflow-hidden h-full border border-white/[0.06] bg-[rgba(14,14,20,0.95)] backdrop-blur-xl transition-all duration-300 group-hover:border-[rgba(0,245,255,0.25)] group-hover:shadow-[0_0_30px_rgba(0,245,255,0.08)]">
        {/* Image section */}
        <div className="relative h-40 md:h-44 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(14,14,20,1)] via-[rgba(14,14,20,0.4)] to-transparent" />
          {/* Colored tint overlay matching the card gradient */}
          <div
            className={`absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500 bg-gradient-to-br ${gradient}`}
          />
          {/* Holographic scan line on image */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,245,255,0.03) 3px, rgba(0,245,255,0.03) 6px)",
            }}
          />
          {/* Top-right corner accent */}
          <div className="absolute top-3 right-3">
            <div
              className={`w-9 h-9 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/10`}
            >
              <Icon className="w-4.5 h-4.5 text-white" />
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className="p-5 md:p-6 pt-3">
          <h3 className="text-base font-semibold text-white font-mono tracking-wide mb-2 group-hover:text-[var(--neon-cyan)] transition-colors duration-300">
            {title}
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
          {/* Bottom accent line */}
          <div className="mt-4 h-[1px] bg-gradient-to-r from-transparent via-[rgba(0,245,255,0.15)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </div>
    </motion.div>
  );
}

/* ── Event detail card ── */
function EventDetailCard({ icon: Icon, label, value, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
      className="flex items-center gap-4 sw-panel p-4 rounded-lg"
    >
      <div className="w-10 h-10 rounded-lg bg-[rgba(0,245,255,0.08)] border border-[rgba(0,245,255,0.15)] flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-[var(--neon-cyan)]" />
      </div>
      <div>
        <span className="sw-label block">{label}</span>
        <span className="text-white font-mono text-sm mt-0.5 block">{value}</span>
      </div>
    </motion.div>
  );
}

/* ── Glowing CTA button ── */
function RegisterButton({ loadDelay = 0, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: loadDelay + 1.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative inline-flex items-center gap-3 cursor-target"
    >
      {/* Pulsing glow behind button */}
      <motion.div
        className="absolute -inset-2 rounded-lg blur-xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,245,255,0.3), rgba(99,102,241,0.3))",
        }}
        animate={{
          opacity: isHovered ? [0.6, 0.9, 0.6] : [0.2, 0.4, 0.2],
          scale: isHovered ? [1, 1.05, 1] : [1, 1.02, 1],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Button */}
      <div className="relative btn-sw-primary px-8 py-4 md:px-12 md:py-5 text-sm md:text-base flex items-center gap-3 rounded-lg">
        <span className="relative z-10 flex items-center gap-3">
          <Rocket className="w-5 h-5" />
          INITIATE REGISTRATION
          <ExternalLink className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
        </span>
      </div>
    </motion.button>
  );
}

/* ── Floating particles ── */
function FloatingParticle({ delay, x, y, size = 2 }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
        background: "var(--neon-cyan)",
        boxShadow: `0 0 ${size * 3}px var(--neon-cyan)`,
      }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.2, 0.8, 0.2],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

/* ── Perks data ── */
const perks = [
  {
    icon: Swords,
    title: "Bounty: ₹30,000+",
    description: "Secure your share of the massive prize pool across Software and Hardware divisions.",
    gradient: "from-yellow-500 to-amber-400",
    image: "/cards/prize-pool.png",
  },
  {
    icon: Satellite,
    title: "Alliances",
    description: "Form squads with top-tier developers and hardware engineers.",
    gradient: "from-blue-500 to-cyan-400",
    image: "/cards/networking.png",
  },
  {
    icon: Zap,
    title: "24-Hour Sprint",
    description: "A brutal 24-hour marathon of coding, soldering, and deploying.",
    gradient: "from-purple-500 to-pink-400",
    image: "/cards/challenge.png",
  },
  {
    icon: Radar,
    title: "Tactical Intel",
    description: "Direct technical guidance from industry veterans.",
    gradient: "from-green-500 to-emerald-400",
    image: "/cards/mentorship.png",
  },
  {
    icon: Terminal,
    title: "Software Division",
    description: "Architect scalable applications and intelligent systems.",
    gradient: "from-indigo-500 to-blue-400",
    image: "/cards/software-track.png",
  },
  {
    icon: Bot,
    title: "Hardware Division",
    description: "Engineer physical prototypes and embedded IoT devices.",
    gradient: "from-red-500 to-rose-400",
    image: "/cards/hardware-track.png",
  },
];

/* ── Event details ── */
const eventDetails = [
  { icon: Orbit, label: "Duration", value: "24 Hours" },
  { icon: Crosshair, label: "Venue", value: "APPLE HALL - SEC " },
  { icon: Bot, label: "Team Size", value: "2 – 5 Members" },
  { icon: Aperture, label: "Tracks", value: "Software & Hardware" },
];

/* ── Track Domains ── */
const trackDomains = {
  software: [
    { title: "Artificial Intelligence & Generative AI", desc: "Build intelligent solutions using AI, machine learning, large language models, computer vision, or automation to solve real-world challenges." },
    { title: "Cybersecurity & Blockchain", desc: "Develop secure, decentralized, and privacy-focused applications that enhance digital trust, data security, and cyber resilience." },
    { title: "Smart Applications & Digital Innovation", desc: "Create impactful software solutions for domains such as healthcare, education, finance, agriculture, sustainability, and smart cities." },
    { title: "Cloud Computing & DevOps", desc: "Design scalable, cloud-native applications, automation pipelines, and modern infrastructure solutions for high-performance systems." },
    { title: "AR/VR & Immersive Technologies", desc: "Build immersive digital experiences using Augmented Reality, Virtual Reality, Mixed Reality, or interactive 3D technologies." }
  ],
  hardware: [
    { title: "Robotics & Intelligent Automation", desc: "Develop autonomous robots and intelligent automation systems that improve productivity, safety, and human interaction." },
    { title: "Drone & UAV Technologies", desc: "Design innovative drone-based solutions for surveillance, agriculture, logistics, disaster response, and autonomous navigation." },
    { title: "IoT & Smart Embedded Systems", desc: "Create connected devices using sensors, embedded systems, and IoT technologies to enable smarter environments and industries." },
    { title: "Smart Mobility & Sustainable Energy", desc: "Build technologies that promote intelligent transportation, electric mobility, renewable energy, and sustainable infrastructure." },
    { title: "Biomedical & Assistive Technologies", desc: "Develop healthcare and assistive hardware solutions that improve accessibility, patient care, and overall quality of life." }
  ]
};

/* ── Main component ── */
export default function ExternalRegistration() {
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const loadDelay = location.state?.fromSingularity ? 1.8 : 0;

  // Signal the global SingularityOverlay to play its arrival animation
  // (reverse the blackhole — exit from hyperspace into this page)
  useEffect(() => {
    // Slight delay so React has painted the DOM before we start revealing it
    const t = setTimeout(() => {
      window.dispatchEvent(new CustomEvent("singularity-arrival"));
    }, 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = () => {
      if (window.scrollY > 100) setShowScrollHint(false);
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="relative min-h-screen bg-bg overflow-hidden">
      <TargetCursor variant="cyan" />

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Cloud Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-70"
        >
          <source src="/cockpit-hero.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay to blend video with the dark theme and ensure text remains readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/50 to-bg z-0 pointer-events-none" />

        <Starfield />
        <HoloScanlines />

        {/* Removed Nebula orbs for cleaner contrast over video */}

        {/* Floating particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 0.4}
            x={10 + Math.random() * 80}
            y={10 + Math.random() * 80}
            size={1.5 + Math.random() * 2.5}
          />
        ))}

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: loadDelay }}
            className="mb-6"
          >
            <span className="section-badge">
              <span className="sw-status-dot" />
              TRANSMISSIONS OPEN
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: loadDelay + 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-[0.06em] text-white mb-2"
            style={{ fontFamily: "'Exo 2', sans-serif" }}
          >
            EXTERNAL
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: loadDelay + 0.35 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-[0.06em] mb-6"
            style={{
              fontFamily: "'Exo 2', sans-serif",
              background: "linear-gradient(135deg, var(--neon-cyan), var(--color-primary), var(--color-secondary))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 30px rgba(0,245,255,0.3))",
            }}
          >
            REGISTRATION
          </motion.h1>

          {/* Typing subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: loadDelay + 0.6 }}
            className="mb-10"
          >
            <p className="text-base md:text-lg text-gray-300 font-mono tracking-wide max-w-2xl mx-auto">
              <TypingText
                text="Calling all Outer Rim hackers & innovators — join the ultimate battle of code and circuits at HACKTRONIX 2.0"
                delay={loadDelay * 1000 + 800}
              />
            </p>
          </motion.div>

          {/* CTA Button */}
          <RegisterButton loadDelay={loadDelay} onClick={() => setIsModalOpen(true)} />

          {/* Scroll hint */}
          <AnimatePresence>
            {showScrollHint && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex flex-col items-center gap-2"
                >
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500">
                    Scroll for intel
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>



      {/* ── Event Details Section ── */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 mt-4">
              Mission{" "}
              <span className="text-[#ff2d55] font-['Exo_2']">Briefing</span>
            </h2>
            <p className="muted max-w-xl mx-auto text-lg">
              Everything you need to know before entering the arena
            </p>
          </motion.div>

          {/* Event details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16 max-w-2xl mx-auto">
            {eventDetails.map((detail, idx) => (
              <EventDetailCard key={detail.label} {...detail} index={idx} />
            ))}
          </div>

          {/* Perks heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Why{" "}
              <span className="text-[#ff2d55] font-['Exo_2']">Join</span>
            </h2>
            <p className="muted max-w-xl mx-auto text-lg">
              The perks of answering the Galactic call
            </p>
          </motion.div>

          {/* Perks grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {perks.map((perk, idx) => (
              <PerkCard key={perk.title} {...perk} index={idx} />
            ))}
          </div>

          {/* Track Domains Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mt-20 mb-10"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Track <span className="text-[var(--neon-cyan)] font-['Exo_2']">Domains</span>
            </h2>
            <p className="muted max-w-xl mx-auto text-lg">
              Explore the domains you can build your solutions around
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Software Domains */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="sw-panel p-6 md:p-8 rounded-xl border border-[rgba(0,245,255,0.15)] bg-[rgba(14,14,20,0.6)] backdrop-blur-xl relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,245,255,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <Terminal className="w-6 h-6 text-[var(--neon-cyan)]" />
                <h3 className="text-xl font-bold text-white font-mono tracking-wide">SOFTWARE TRACK</h3>
              </div>
              <div className="space-y-5 relative z-10">
                {trackDomains.software.map((domain, idx) => (
                  <div key={idx} className="group/item">
                    <h4 className="text-[var(--neon-cyan)] font-semibold text-sm md:text-base mb-1">{idx + 1}. {domain.title}</h4>
                    <p className="text-sm text-gray-400 group-hover/item:text-gray-300 transition-colors leading-relaxed">{domain.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Hardware Domains */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="sw-panel p-6 md:p-8 rounded-xl border border-[rgba(255,45,85,0.15)] bg-[rgba(14,14,20,0.6)] backdrop-blur-xl relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,45,85,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <Bot className="w-6 h-6 text-[#ff2d55]" />
                <h3 className="text-xl font-bold text-white font-mono tracking-wide">HARDWARE TRACK</h3>
              </div>
              <div className="space-y-5 relative z-10">
                {trackDomains.hardware.map((domain, idx) => (
                  <div key={idx} className="group/item">
                    <h4 className="text-[#ff2d55] font-semibold text-sm md:text-base mb-1">{idx + 1}. {domain.title}</h4>
                    <p className="text-sm text-gray-400 group-hover/item:text-gray-300 transition-colors leading-relaxed">{domain.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Final CTA Section ── */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/8 rounded-full blur-[100px] pointer-events-none" />
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Decorative bracket */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[var(--neon-cyan)] to-transparent opacity-60" />
            </div>

            <h2
              className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-[0.04em]"
              style={{ fontFamily: "'Exo 2', sans-serif" }}
            >
              Ready to{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, var(--neon-cyan), var(--color-primary))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Launch
              </span>
              ?
            </h2>
            <p className="text-gray-400 font-mono text-sm md:text-base max-w-xl mx-auto mb-10 leading-relaxed">
              Secure your position in HACKTRONIX 2.0. Fill out the registration form and
              prepare for the ultimate hackathon experience.
            </p>

            <RegisterButton onClick={() => setIsModalOpen(true)} />

            {/* Footer note */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-xs text-gray-600 font-mono"
            >
              Registration is now open • Teams of 2-5 members
            </motion.p>
          </motion.div>
        </div>
      </section>

      <RegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
