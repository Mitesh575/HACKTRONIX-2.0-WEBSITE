import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Swords, Shield } from "lucide-react";

const prizes = [
  { rank: "1st", amount: "₹15,000", icon: Swords },
  { rank: "2nd", amount: "₹10,000", icon: Shield },
  { rank: "3rd", amount: "₹5,000", icon: Shield },
];

const displayOrder = [prizes[2], prizes[0], prizes[1]];

const gradients = {
  "1st": "from-yellow-500 to-amber-400",
  "2nd": "from-gray-300 to-gray-400",
  "3rd": "from-orange-600 to-amber-600",
};

function useCountUp(target, duration = 1500, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    const numericTarget = parseInt(target.replace(/[^0-9]/g, ""), 10);
    const prefix = target.match(/^[^0-9]*/)[0];
    const suffix = target.replace(/^[^0-9]*/, "").replace(/[0-9]/g, "");
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * numericTarget));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(numericTarget);
    };

    requestAnimationFrame(step);
    return () => { };
  }, [start, target, duration]);

  return `${target.match(/^[^0-9]*/)[0]}${count.toLocaleString()}`;
}

function PrizeCard({ rank, amount, icon: Icon, index }) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const animatedAmount = useCountUp(amount, 1400, started);
  const gradient = gradients[rank];
  const isFirst = rank === "1st";

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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative"
    >
      <div className="h-full rounded-sm border border-white/8 bg-[rgba(14,14,20,0.92)] overflow-hidden transition-all duration-300 hover:border-[rgba(0,245,255,0.15)] hover:shadow-[0_0_12px_rgba(0,245,255,0.04)]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(0,245,255,0.2)] to-transparent" />
        <div className={`absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b ${gradient} opacity-25`} />
        <div className="p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className={`flex h-11 w-11 items-center justify-center rounded-sm bg-gradient-to-r ${gradient}`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            {isFirst && (
              <span
                className="rounded-sm px-3 py-1 text-[10px] font-bold font-mono tracking-wider uppercase"
                style={{ background: "linear-gradient(90deg, var(--neon-yellow), #ffe600)", color: "#000", boxShadow: "0 0 12px rgba(255,230,0,0.4)" }}
              >
                WINNER
              </span>
            )}
            {!isFirst && (
              <span className="sw-label-warning">
                {rank === "2nd" ? "RUNNER-UP" : rank.toUpperCase()}
              </span>
            )}
          </div>
          <h3 className="mb-1 text-lg font-semibold text-white font-mono tracking-wide">{rank} Place</h3>
          <p className={`text-2xl font-bold font-mono bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {animatedAmount}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Prizes() {
  return (
    <section id="prizes" className="py-12 md:py-20 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 mt-4">
            Win Exciting <span className="text-[#ff2d55] font-['Exo_2']">Rewards</span>
          </h2>
          <p className="muted max-w-xl mx-auto text-lg">
            Compete for cash prizes and exclusive goodies
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {displayOrder.map((prize, idx) => (
            <PrizeCard key={prize.rank} {...prize} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}