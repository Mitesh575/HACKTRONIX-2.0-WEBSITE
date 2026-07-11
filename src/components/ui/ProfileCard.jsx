import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LinkedinIcon = ({ className, size = 24 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const ProfileCard = ({
  avatarUrl,
  name = 'Team Member',
  title = 'Member',
  linkedinUrl = '#',
  bgSize,
  bgPosition,
  nameSize,
}) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const match = window.matchMedia('(hover: none)');
    setIsTouchDevice(match.matches);

    const handler = (e) => setIsTouchDevice(e.matches);
    if (match.addEventListener) {
      match.addEventListener('change', handler);
      return () => match.removeEventListener('change', handler);
    } else if (match.addListener) {
      match.addListener(handler);
      return () => match.removeListener(handler);
    }
  }, []);

  const hasLinkedin = linkedinUrl && linkedinUrl !== '#';

  return (
    <motion.div
      className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer"
      whileHover={!isTouchDevice ? "hover" : undefined}
      initial={isTouchDevice ? "hover" : "rest"}
      animate={isTouchDevice ? "hover" : "rest"}
      style={{
        boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 8px 30px rgba(0,0,0,0.4)',
      }}
    >
      {/* Background Image — fills entire card */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${avatarUrl})`,
          backgroundSize: bgSize || 'cover',
          backgroundPosition: bgPosition || 'center top',
          backgroundRepeat: 'no-repeat',
        }}
        variants={{
          rest: { scale: 1, filter: 'brightness(0.85)' },
          hover: { scale: 1.08, filter: 'brightness(1)' },
        }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />

      {/* Permanent subtle vignette at bottom for readability */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 35%, transparent 60%)',
        }}
      />

      {/* Info panel */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-5"
        variants={{
          rest: { y: isTouchDevice ? 0 : 28 }, // Push down slightly so role is hidden
          hover: { y: 0 },
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      >
        <div
          className="rounded-xl px-4 py-3 backdrop-blur-md border border-white/10"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3
                className="text-white font-bold leading-tight truncate uppercase tracking-wide"
                style={{ fontSize: nameSize || '0.95rem' }}
              >
                {name}
              </h3>
              <motion.div
                variants={{
                  rest: { opacity: isTouchDevice ? 1 : 0, height: isTouchDevice ? 'auto' : 0, marginTop: 0 },
                  hover: { opacity: 1, height: 'auto', marginTop: 2 },
                }}
                className="overflow-hidden"
              >
                <p className="text-gray-300/80 text-xs font-mono tracking-wider truncate">
                  {title}
                </p>
              </motion.div>
            </div>

            {hasLinkedin && (
              <motion.a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                variants={{
                  rest: { opacity: isTouchDevice ? 1 : 0, scale: isTouchDevice ? 1 : 0.8 },
                  hover: { opacity: 1, scale: 1 },
                }}
                className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 hover:bg-[#0a66c2]/80 flex items-center justify-center transition-colors duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <LinkedinIcon size={16} className="text-white hover:scale-110 transition-transform" />
              </motion.a>
            )}
          </div>
        </div>
      </motion.div>

      {/* Subtle inner border highlight */}
      <div className="absolute inset-0 rounded-2xl border border-white/[0.06] pointer-events-none z-20" />
    </motion.div>
  );
};

export default ProfileCard;