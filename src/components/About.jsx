import { motion } from "framer-motion";
import { Orbit, Crosshair, Terminal, Bot } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-16 md:py-32 relative overflow-hidden">
      {/* Subtle grid background instead of generic blobs */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

          {/* Left Column: Typography & Story */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-12 bg-[#ff2d55]" />
              <span className="text-[#ff2d55] font-mono text-sm tracking-[0.2em] uppercase">Status: Initializing</span>
            </div>

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6 leading-tight font-['Exo_2']">
              BUILD.<br />
              BREAK.<br />
              <span className="text-[#ff2d55]">
                DEPLOY.
              </span>
            </h2>

            <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 md:mb-10 font-light">
              Hacktronix 2.0 is a premier 24-hour national-level hackathon designed to bring together the brightest minds in technology. Whether you're a software developer, hardware enthusiast, or problem solver, this is your platform to innovate, collaborate, and build impactful solutions to real-world challenges.
            </p>

            <div className="flex gap-6">
              <div className="flex flex-col">
                <span className="text-white font-mono text-2xl font-bold">24</span>
                <span className="text-gray-500 text-xs uppercase tracking-widest mt-1">Hours</span>
              </div>
              <div className="w-[1px] bg-white/10" />
              <div className="flex flex-col">
                <span className="text-white font-mono text-2xl font-bold">2</span>
                <span className="text-gray-500 text-xs uppercase tracking-widest mt-1">Tracks</span>
              </div>
              <div className="w-[1px] bg-white/10" />
              <div className="flex flex-col">
                <span className="text-white font-mono text-2xl font-bold">₹30K</span>
                <span className="text-gray-500 text-xs uppercase tracking-widest mt-1">Bounty</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Mission Specs (Asymmetrical Grid) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4"
          >
            {/* Spec Card 1 */}
            <div className="p-4 md:p-8 rounded-xl md:rounded-2xl bg-[#0a0a0c] border border-white/5 hover:border-red-500/30 transition-colors group">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 md:mb-12 group-hover:bg-red-500/20 transition-colors">
                <Orbit className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
              </div>
              <span className="block text-gray-500 font-mono text-[10px] md:text-xs mb-1 md:mb-2 tracking-widest uppercase">Launch Window</span>
              <span className="block text-white font-medium text-sm md:text-lg">Aug 6 - 7, 2026</span>
            </div>

            {/* Spec Card 2 */}
            <div className="p-4 md:p-8 rounded-xl md:rounded-2xl bg-[#0a0a0c] border border-white/5 hover:border-orange-500/30 transition-colors group md:translate-y-8">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4 md:mb-12 group-hover:bg-orange-500/20 transition-colors">
                <Crosshair className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
              </div>
              <span className="block text-gray-500 font-mono text-[10px] md:text-xs mb-1 md:mb-2 tracking-widest uppercase">Coordinates</span>
              <span className="block text-white font-medium text-sm md:text-lg">SEC - APPLE LAB</span>
            </div>

            {/* Spec Card 3 */}
            <div className="p-4 md:p-8 rounded-xl md:rounded-2xl bg-[#0a0a0c] border border-white/5 hover:border-blue-500/30 transition-colors group">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 md:mb-12 group-hover:bg-blue-500/20 transition-colors">
                <Terminal className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
              </div>
              <span className="block text-gray-500 font-mono text-[10px] md:text-xs mb-1 md:mb-2 tracking-widest uppercase">Software Track</span>
              <p className="text-gray-400 text-xs md:text-sm leading-relaxed mt-1 md:mt-2">Architect scalable applications and intelligent systems.</p>
            </div>

            {/* Spec Card 4 */}
            <div className="p-4 md:p-8 rounded-xl md:rounded-2xl bg-[#0a0a0c] border border-white/5 hover:border-emerald-500/30 transition-colors group md:translate-y-8">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 md:mb-12 group-hover:bg-emerald-500/20 transition-colors">
                <Bot className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
              </div>
              <span className="block text-gray-500 font-mono text-[10px] md:text-xs mb-1 md:mb-2 tracking-widest uppercase">Hardware Track</span>
              <p className="text-gray-400 text-xs md:text-sm leading-relaxed mt-1 md:mt-2">Engineer physical prototypes and embedded IoT devices.</p>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
