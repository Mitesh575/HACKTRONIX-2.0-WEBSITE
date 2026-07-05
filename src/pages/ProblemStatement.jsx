import { useRef } from "react";
import { motion } from "framer-motion";
import { Radar } from "lucide-react";
import Galaxy from "../components/Galaxy";
import TargetCursor from "../components/TargetCursor";
import GlassCard from "../components/ui/GlassCard";

const problemStatements = [
  {
    id: 1,
    title: "3D LiDAR-Based Shelter Damage Inspection System",
    description: "Participants are tasked with designing and implementing a shelter inspection system capable of scanning rectangular shelters using a 3D LiDAR sensor, precisely localising structural damage, and classifying that damage by structural zone - all without human intervention.",
    link: "https://drive.google.com/file/d/1LwlWeTPbcRv1fw_wZ0SG8I07at4fV2Sj/view",
  },
  {
    id: 2,
    title: "World Modeling for Autonomous Agents",
    description: "Most AI agents today work by keeping every observation stuffed into an ever-growing context window. The longer they run, the slower, costlier, and more confused they get. The real problem is the representation. A capable agent does not need to remember every conversation. It needs a structured model of the world it is operating in - updated continuously, queried efficiently, and compact enough to fit inside a small model's context.",
    link: "https://drive.google.com/file/d/1Zla3J8weI8iNFIuNUz1NoR2KcdTonukL/view",
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0.1) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

export default function ProblemStatementPage() {
  return (
    <div className="min-h-screen">
      <TargetCursor variant="cyan" />
      <div className="fixed inset-0 -z-10 opacity-95" style={{ width: "100vw", height: "100vh" }}>
        <Galaxy mouseInteraction={false} density={0.65} glowIntensity={0.2} saturation={0.08} />
      </div>

      <main className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <div className="section-badge mb-6">
              <Radar className="h-4 w-4" />
              Challenge
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
              Problem <span className="text-[#ff2d55] font-['Exo_2']">Statements</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-400">
              Choose your challenge. Each problem statement presents a unique opportunity to innovate and create impactful solutions.
            </p>
          </motion.div>

          <div className="mt-16 space-y-8">
            {problemStatements.map((ps, idx) => (
              <motion.div
                key={ps.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <GlassCard className="p-6 md:p-8 rounded-sm">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-10 h-10 rounded-sm bg-cyan-500/10 flex items-center justify-center text-sm font-bold text-cyan-400 border border-cyan-500/20">
                      {ps.id}
                    </span>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-white mb-3">{ps.title}</h2>
                      <p className="text-gray-300 leading-relaxed mb-4">{ps.description}</p>
                      <a
                        href={ps.link}
                        className="inline-flex items-center text-sm font-mono tracking-wide text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
                      >
                        click to view the problem statement
                      </a>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}