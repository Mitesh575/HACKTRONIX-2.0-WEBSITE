import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Satellite, Radar, Terminal, Bot, Swords, Orbit, Hourglass } from "lucide-react";

const features = [
  {
    title: "Network",
    description: "Connect with top-tier developers and hardware engineers.",
    icon: Satellite,
    color: "0, 245, 255", // Cyan glow
  },
  {
    title: "Mentorship",
    description: "Get unfiltered, direct technical guidance from industry veterans.",
    icon: Radar,
    color: "168, 85, 247", // Purple glow
  },
  {
    title: "Experience",
    description: "Build raw projects from scratch. No tutorials, just execution.",
    icon: Terminal,
    color: "245, 158, 11", // Amber glow
  },
];

const stats = [
  { value: "100+", label: "Participants", icon: Bot, gradient: "from-primary to-secondary" },
  { value: "₹30,000", label: "Prize Pool", icon: Swords, gradient: "from-green-500 to-emerald-400" },
  { value: "2", label: "Domains", icon: Orbit, gradient: "from-blue-500 to-cyan-400" },
  { value: "24", label: "Hours", icon: Hourglass, gradient: "from-purple-500 to-pink-400" },
];

function useCountUp(target, duration = 1500, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    const numericMatch = target.match(/^([^0-9]*)([0-9,]+)(.*)$/);
    if (!numericMatch) { setCount(target); return; }
    const prefix = numericMatch[1];
    const numStr = numericMatch[2].replace(/,/g, "");
    const suffix = numericMatch[3];
    const numericTarget = parseInt(numStr, 10);
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * numericTarget);
      setCount(`${prefix}${current.toLocaleString()}${suffix}`);
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };

    requestAnimationFrame(step);
  }, [start, target, duration]);

  return count;
}

function FeatureCard({ title, description, icon: Icon, color, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="pgc-card"
      style={{ "--color": color }}
    >
      <div className="pgc-card-base" />
      <div className="pgc-card-blob" />
      <div className="pgc-card-blob2" />
      
      <div className="pgc-card-is pgc-card-is1" />
      <div className="pgc-card-is pgc-card-is2" />
      <div className="pgc-card-is pgc-card-is3" />
      
      <div className="pgc-hover-layer">
        <div className="pgc-hover-fill" />
        <div className="pgc-hover-border" />
      </div>

      <div className="relative z-10 p-8 h-full flex flex-col justify-between">
        <div className="w-14 h-14 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(var(--color),0.5)] backdrop-blur-md">
          <Icon className="w-7 h-7 text-white drop-shadow-[0_0_10px_rgba(var(--color),0.8)]" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2 font-mono uppercase tracking-wide">{title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ value, label, icon: Icon, gradient, index }) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const animatedValue = useCountUp(value, 1400, started);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass rounded-2xl p-6 text-center border border-white/10 hover:border-[rgba(0,245,255,0.15)] transition-colors"
    >
      <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${gradient} flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className={`text-3xl md:text-4xl font-bold font-mono bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-2`}>
        {animatedValue}
      </p>
      <p className="muted text-sm font-mono uppercase tracking-widest">{label}</p>
    </motion.div>
  );
}

export default function WhyJoinUs() {
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll(".pgc-card");
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll(".pgc-card");
    const speed = 0.0003;
    let animationFrameId;

    const animateBlobs = () => {
      const time = performance.now() * speed;
      cards.forEach((card, index) => {
        const blob = card.querySelector(".pgc-card-blob");
        const blob2 = card.querySelector(".pgc-card-blob2");
        if (!blob || !blob2) return;

        const W = card.offsetWidth;
        const H = card.offsetHeight;
        
        const offset1 = index * 2.5;
        const offset2 = index * 1.8;
        
        const b1x = (W / 2) + Math.sin(time + offset1) * (W * 0.25) - (blob.offsetWidth / 2);
        const b1y = (H / 2) + Math.cos(time * 0.8 + offset1) * (H * 0.25) - (blob.offsetHeight / 2);
        
        const b2x = (W / 2) + Math.cos(time * 1.2 + offset2) * (W * 0.3) - (blob2.offsetWidth / 2);
        const b2y = (H / 2) + Math.sin(time * 0.9 + offset2) * (H * 0.3) - (blob2.offsetHeight / 2);
        
        blob.style.transform = `translate(${b1x}px, ${b1y}px)`;
        blob2.style.transform = `translate(${b2x}px, ${b2y}px)`;
      });
      animationFrameId = requestAnimationFrame(animateBlobs);
    };
    
    animateBlobs();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <section id="why-join" className="py-12 md:py-20 relative overflow-hidden">
      <style>{`
        .pgc-scene-wrapper {
            --stroke-glow-strength: 0.9;
            --stroke-glow-size: 350px;
            --bg-opacity: 0.5;
            --base-stroke-width: 1px;
            --base-stroke-opacity: 0.25;
            --base-glow-radius: 8px;
            --base-glow-opacity: 0.15;
        }

        .pgc-card { 
            position: relative;
            width: 100%;
            height: 240px;
            border-radius: 22px; 
            overflow: hidden; 
            cursor: pointer; 
            isolation: isolate; 
            border: var(--base-stroke-width) solid rgba(255, 255, 255, var(--base-stroke-opacity));
            box-shadow: 0 0 var(--base-glow-radius) rgba(255, 255, 255, var(--base-glow-opacity));
            transition: filter 0.5s ease, transform 0.4s ease;
        }

        .pgc-scene-wrapper:has(.pgc-card:hover) .pgc-card:not(:hover) {
            filter: saturate(0.1) brightness(0.4) opacity(0.85);
        }
        .pgc-card:hover {
            filter: saturate(1.2) brightness(1.1);
        }

        .pgc-card-base { 
            position: absolute; 
            inset: 0; 
            border-radius: 22px; 
            z-index: 0; 
            background: linear-gradient(160deg, rgba(var(--color), 0.18) 0%, rgba(3,3,10, var(--bg-opacity)) 100%); 
        }

        .pgc-card-blob { 
            position: absolute; top: 0; left: 0; width: 75%; height: 75%; border-radius: 50%; z-index: 1; pointer-events: none; filter: blur(35px); will-change: transform; 
            background: radial-gradient(circle, rgba(var(--color),0.85) 0%, rgba(var(--color),0.3) 60%, transparent 80%); 
        }
        .pgc-card-blob2 { 
            position: absolute; top: 0; left: 0; width: 55%; height: 55%; border-radius: 50%; z-index: 1; pointer-events: none; filter: blur(25px); opacity: 0.9; will-change: transform; 
            background: radial-gradient(circle, rgba(var(--color),0.75) 0%, transparent 70%); 
        }

        .pgc-card-is { position: absolute; inset: 0; border-radius: 22px; pointer-events: none; }
        .pgc-card-is1 { z-index: 3; box-shadow: inset 0 -70px 55px -25px rgba(var(--color),0.4); }
        .pgc-card-is2 { z-index: 4; box-shadow: inset 0 -35px 25px -6px rgba(var(--color),0.2); }
        .pgc-card-is3 { z-index: 5; mix-blend-mode: plus-lighter; box-shadow: inset 0 -18px 18px -5px rgba(255,255,255,0.1); }

        .pgc-hover-layer { position: absolute; inset: 0; border-radius: 22px; z-index: 9; pointer-events: none; opacity: 0; transition: opacity 0.5s ease; }
        .pgc-scene-wrapper:hover .pgc-hover-layer { opacity: 1; }

        .pgc-hover-border { 
            position: absolute; inset: 0; border-radius: 22px; padding: 1.5px; 
            background: radial-gradient(var(--stroke-glow-size) circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(var(--color), var(--stroke-glow-strength)), transparent 45%); 
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; 
        }

        .pgc-hover-fill { 
            position: absolute; inset: 0; border-radius: 22px; 
            background: radial-gradient(350px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(var(--color), 0.04), transparent 60%); 
        }
      `}</style>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pgc-scene-wrapper" ref={containerRef} onMouseMove={handleMouseMove}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 mt-4">
            Level Up Your <span className="text-[#ff2d55] font-['Exo_2']">Skills</span>
          </h2>
          <p className="muted max-w-xl mx-auto text-lg">
            Join HACKTRONIX 2.0 and accelerate your journey in tech innovation
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {features.map((feature, idx) => (
            <FeatureCard key={feature.title} {...feature} index={idx} />
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <StatCard key={stat.label} {...stat} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
