import { useRef } from "react";
import { motion } from "framer-motion";
import { 
  Rocket, 
  FileCode2, 
  Users, 
  Mic, 
  Target, 
  Upload, 
  Clock, 
  Trophy 
} from "lucide-react";

const timelineEvents = [
  { date: "Jul 10", event: "Registrations Open", description: "Sign up and grab your spot for the hackathon", icon: Rocket, color: "text-cyan-400", border: "border-cyan-400" },
  { date: "Jul 15", event: "Problem Statement Release", description: "Software and hardware tracks revealed", icon: FileCode2, color: "text-blue-500", border: "border-blue-500" },
  { date: "Jul 20", event: "Team Formation Deadline", description: "Final day to form teams", icon: Users, color: "text-indigo-500", border: "border-indigo-500" },
  { date: "Jul 25", event: "Mentor Connect Round", description: "First round of mentor interactions and guidance", icon: Mic, color: "text-purple-500", border: "border-purple-500" },
  { date: "Jul 30", event: "Progress Checkpoint", description: "Mid-event review and feedback session", icon: Target, color: "text-fuchsia-500", border: "border-fuchsia-500" },
  { date: "Aug 4", event: "Submission Window Opens", description: "Teams can start uploading their projects", icon: Upload, color: "text-pink-500", border: "border-pink-500" },
  { date: "Aug 6", event: "Final Submission Deadline", description: "Last chance to submit your project", icon: Clock, color: "text-rose-500", border: "border-rose-500" },
  { date: "Aug 7", event: "Evaluation & Results", description: "Winners announced and prizes distributed", icon: Trophy, color: "text-amber-400", border: "border-amber-400" },
];

function TimelineCard({ item, index, isLeft }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -20 : 20, y: 10 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 100 }}
      className="w-full max-w-sm"
    >
      <div className="relative group rounded-xl border border-white/5 bg-[rgba(14,14,20,0.8)] backdrop-blur-md p-4 md:p-6 transition-all duration-300 hover:border-white/10 hover:shadow-lg hover:bg-[rgba(20,20,28,0.9)]">
        {/* Only show date on mobile inside the card. On desktop it's in the opposite content */}
        <div className={`md:hidden text-xs font-bold mb-2 uppercase tracking-widest ${item.color}`}>
          {item.date}
        </div>
        
        <h3 className="text-base md:text-lg font-bold text-white font-mono tracking-wide group-hover:text-[var(--neon-cyan)] transition-colors">
          {item.event}
        </h3>
        <p className="mt-1 md:mt-2 text-sm text-gray-400 leading-relaxed">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

function TimelineOppositeContent({ item, index, isLeft }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? 20 : -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 + 0.1 }}
      className={`hidden md:flex w-full items-center ${isLeft ? 'justify-start pl-8' : 'justify-end pr-8'}`}
    >
      <span className={`text-xl font-bold font-mono tracking-widest ${item.color}`}>
        {item.date}
      </span>
    </motion.div>
  );
}

function TimelineDot({ item, index }) {
  const Icon = item.icon;
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotate: -45 }}
      whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5, type: "spring", bounce: 0.5 }}
      className={`relative z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[rgba(14,14,20,1)] border-2 ${item.border} flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 cursor-default`}
    >
      {/* Outer glow ring */}
      <div className={`absolute inset-[-6px] rounded-full border border-current opacity-20 animate-pulse ${item.color}`} />
      
      {/* Icon */}
      <Icon className={`w-4 h-4 md:w-5 md:h-5 ${item.color}`} />
    </motion.div>
  );
}

export default function Timeline() {
  const sectionRef = useRef(null);

  return (
    <section ref={sectionRef} id="timeline" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-[100px]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 mt-4">
            Event <span className="text-[#ff2d55] font-['Exo_2']">Schedule</span>
          </h2>
          <p className="muted max-w-xl mx-auto text-base md:text-lg">
            Key dates and milestones for HackTronix 2.0
          </p>
        </motion.div>

        {/* MOBILE: Left-aligned timeline */}
        <div className="md:hidden relative pl-8">
          {/* Left spine connector */}
          <div className="absolute left-[19px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-cyan-400 via-purple-500 to-amber-500 rounded-full opacity-50" />

          <div className="space-y-10">
            {timelineEvents.map((item, idx) => (
              <div key={idx} className="relative">
                {/* Dot */}
                <div className="absolute left-[-32px] top-2 w-10 flex items-center justify-center">
                  <TimelineDot item={item} index={idx} />
                </div>
                {/* Card */}
                <div className="pt-0 pl-6">
                  <TimelineCard item={item} index={idx} isLeft={true} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DESKTOP: Alternating timeline (MUI style) */}
        <div className="hidden md:block relative">
          {/* Center spine connector */}
          <div className="absolute left-1/2 top-10 bottom-10 -translate-x-1/2 w-[2px] bg-gradient-to-b from-cyan-400 via-purple-500 to-amber-500 rounded-full opacity-50" />

          <div className="space-y-2">
            {timelineEvents.map((item, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <div key={idx} className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-6 group">
                  
                  {/* Left Column */}
                  <div className="flex justify-end">
                    {isLeft ? (
                      <TimelineCard item={item} index={idx} isLeft={true} />
                    ) : (
                      <TimelineOppositeContent item={item} index={idx} isLeft={false} />
                    )}
                  </div>

                  {/* Center Dot Container */}
                  <div className="relative flex flex-col items-center justify-center h-full w-16 py-8">
                    <TimelineDot item={item} index={idx} />
                  </div>

                  {/* Right Column */}
                  <div className="flex justify-start">
                    {!isLeft ? (
                      <TimelineCard item={item} index={idx} isLeft={false} />
                    ) : (
                      <TimelineOppositeContent item={item} index={idx} isLeft={true} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}