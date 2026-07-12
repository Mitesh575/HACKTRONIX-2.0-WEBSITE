import { useRef } from "react";
import { motion } from "framer-motion";

const timelineEvents = [
  { date: "Jul 10", event: "Registrations Open", description: "Registration period begins for all participants", color: "from-cyan-400 to-blue-500" },
  { date: "Jul 15", event: "Problem Statement Release", description: "Software and hardware tracks revealed", color: "from-blue-500 to-indigo-500" },
  { date: "Jul 20", event: "Team Formation Deadline", description: "Final day to form teams", color: "from-indigo-500 to-purple-500" },
  { date: "Jul 25", event: "Mentor Connect Round", description: "First round of mentor interactions and guidance", color: "from-purple-500 to-fuchsia-500" },
  { date: "Jul 30", event: "Progress Checkpoint", description: "Mid-event review and feedback session", color: "from-fuchsia-500 to-pink-500" },
  { date: "Aug 4", event: "Submission Window Opens", description: "Teams can start uploading their projects", color: "from-pink-500 to-rose-500" },
  { date: "Aug 6", event: "Final Submission Deadline", description: "Last chance to submit your project", color: "from-rose-500 to-orange-500" },
  { date: "Aug 7", event: "Evaluation & Results", description: "Winners announced and prizes distributed", color: "from-orange-500 to-amber-400" },
];

function TimelineCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.08, type: "spring", stiffness: 100, damping: 18 }}
      className="w-full"
    >
      <div className="relative group rounded-xl border border-[rgba(0,245,255,0.08)] bg-[rgba(14,14,20,0.92)] backdrop-blur-sm p-4 md:p-6 transition-all duration-300 hover:border-[rgba(0,245,255,0.2)] hover:shadow-[0_0_16px_rgba(0,245,255,0.06)]">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[rgba(0,245,255,0.3)] to-transparent" />
        <div className="absolute left-0 top-0 w-[3px] h-full bg-gradient-to-b from-[rgba(0,245,255,0.2)] to-transparent opacity-40" />
        <span className="sw-label">{item.date}</span>
        <h3 className="mt-1.5 text-sm md:text-base font-semibold text-white font-mono tracking-wide group-hover:text-[var(--neon-cyan)] transition-colors">{item.event}</h3>
        <p className="mt-1 md:mt-1.5 text-xs md:text-sm text-gray-400 leading-relaxed">{item.description}</p>
      </div>
    </motion.div>
  );
}

function TimelineDot({ index }) {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.08 + 0.15, duration: 0.4, type: "spring" }}
      className="relative z-10 w-3.5 h-3.5 md:w-4 md:h-4 rounded-sm bg-[var(--color-bg)] border-2 border-[var(--neon-cyan)] shadow-[0_0_12px_rgba(0,245,255,0.5)]"
    >
      <div className="absolute inset-[-6px] rounded-full border border-[rgba(0,245,255,0.25)] animate-neon-pulse-ring" />
      <div className="absolute inset-[3px] rounded-sm bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--color-primary)]" />
    </motion.div>
  );
}

export default function Timeline() {
  const sectionRef = useRef(null);

  return (
    <section ref={sectionRef} id="timeline" className="py-12 md:py-20 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 mt-4">
            Event <span className="text-[#ff2d55] font-['Exo_2']">Schedule</span>
          </h2>
          <p className="muted max-w-xl mx-auto text-base md:text-lg">
            Key dates and milestones for HackTronix 2.0
          </p>
        </motion.div>

        {/* MOBILE: Single-column with left-aligned spine */}
        <div className="md:hidden relative pl-8">
          {/* Left spine */}
          <div className="absolute left-[13px] top-0 bottom-0 w-[3px] bg-gradient-to-b from-[var(--neon-cyan)] via-[var(--color-primary)] to-[var(--color-secondary)] rounded-sm shadow-[0_0_10px_rgba(0,245,255,0.5),0_0_20px_rgba(99,102,241,0.3)]" />

          {timelineEvents.map((item, idx) => (
            <div key={idx} className="relative mb-6 last:mb-0">
              {/* Dot aligned with the spine */}
              <div className="absolute -left-8 top-4 flex items-center justify-center w-7">
                <TimelineDot index={idx} />
              </div>
              <TimelineCard item={item} index={idx} />
            </div>
          ))}
        </div>

        {/* DESKTOP: Alternating two-column layout */}
        <div className="hidden md:block relative">
          {/* Center spine */}
          <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[3px] bg-gradient-to-b from-[var(--neon-cyan)] via-[var(--color-primary)] to-[var(--color-secondary)] rounded-sm shadow-[0_0_10px_rgba(0,245,255,0.5),0_0_20px_rgba(99,102,241,0.3)]" />

          {timelineEvents.map((item, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <div key={idx} className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-4 mb-12 last:mb-0">
                {/* Left Column */}
                <div className="flex justify-end pr-8">
                  {isLeft ? <TimelineCard item={item} index={idx} /> : null}
                </div>

                {/* Center dot */}
                <div className="relative flex flex-col items-center justify-center w-10">
                  <TimelineDot index={idx} />
                </div>

                {/* Right Column */}
                <div className="flex justify-start pl-8">
                  {!isLeft ? <TimelineCard item={item} index={idx} /> : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}