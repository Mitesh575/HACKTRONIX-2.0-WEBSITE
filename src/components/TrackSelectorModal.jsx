import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Bot, Terminal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GlassCard from "./ui/GlassCard";

function TrackOption({ title, description, icon: Icon, href, onSelect }) {
  return (
    <GlassCard
      as="button"
      type="button"
      interactive
      onClick={() => onSelect(href)}
      className="cursor-target w-full p-6 md:p-8 text-left"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white">
          <Icon className="h-7 w-7" />
        </div>
        <ArrowRight className="h-5 w-5 text-gray-500" />
      </div>
      <h3 className="mb-2 text-2xl font-semibold text-white">{title}</h3>
      <p className="max-w-sm text-sm leading-6 text-gray-400">{description}</p>
    </GlassCard>
  );
}

export default function TrackSelectorModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleSelect = (href) => {
    onClose();
    navigate(href);
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-surface p-6 md:p-8 shadow-2xl shadow-black/30">
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <div className="section-badge mb-4">Track Selection</div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Choose your domain</h2>
                  <p className="mt-2 text-sm md:text-base text-gray-400">Pick the track you want to explore. Each track opens its own dedicated experience page.</p>
                </div>
                <button onClick={onClose} className="cursor-target rounded-xl border border-white/10 bg-bg/70 p-2 text-gray-400 transition hover:text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <TrackOption
                  title="Software"
                  description="Explore platform ideas, AI experiences, automation products, and digital systems."
                  icon={Terminal}
                  href="/software"
                  onSelect={handleSelect}
                />
                <TrackOption
                  title="Hardware"
                  description="Dive into embedded systems, IoT builds, automation, sensing, and physical prototypes."
                  icon={Bot}
                  href="/hardware"
                  onSelect={handleSelect}
                />
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
