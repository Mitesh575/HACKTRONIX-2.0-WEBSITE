import React from 'react';
import { motion } from 'framer-motion';

const LinkedinIcon = ({ className, size = 24 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const SvgRightCutout = ({ className, style }) => (
  <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" overflow="visible" fill="currentColor">
    <path d="M 6.018 19.789 C 4.705 20 3.137 20 0 20 L 20 20 L 20 0 C 20 3.137 20 4.705 19.789 6.018 C 18.65 13.098 13.098 18.65 6.018 19.789 Z" />
  </svg>
);

const SvgLeftCutout = ({ className, style }) => (
  <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" overflow="visible" fill="currentColor">
    <path d="M 13.982 19.789 C 15.295 20 16.863 20 20 20 L 0 20 L 0 0 C 0 3.137 0 4.705 0.211 6.018 C 1.35 13.098 6.902 18.65 13.982 19.789 Z" />
  </svg>
);

const ProfileCard = ({
  avatarUrl,
  name = 'Team Member',
  title = 'Member',
  linkedinUrl = '#',
}) => {
  // Theme color for the content block
  const bgColor = '#121214'; // Very dark gray/black
  
  return (
    <motion.div 
      className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 group cursor-pointer bg-zinc-900"
      whileHover="hover"
      initial="rest"
      animate="rest"
    >
      {/* Background Image */}
      <motion.img 
        src={avatarUrl} 
        alt={name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out"
        variants={{
          rest: { scale: 1, filter: 'grayscale(30%) brightness(0.8)' },
          hover: { scale: 1.05, filter: 'grayscale(0%) brightness(1.1)' }
        }}
      />

      {/* Main Content Block (bottom) */}
      <div 
        className="absolute bottom-0 left-0 w-full flex flex-col justify-end pt-4 pb-5 px-6 z-10"
        style={{ backgroundColor: bgColor }}
      >
        {/* Right Corner Cutout (Top Right of Bottom Block) */}
        <SvgRightCutout 
          className="absolute right-0 top-[-20px] w-5 h-5" 
          style={{ color: bgColor }} 
        />

        {/* Subtitle / Role (Always visible or fades in) */}
        <div className="relative z-20 flex justify-between items-center w-full min-h-[24px]">
          <motion.p 
            className="text-gray-400 font-medium text-sm tracking-wide font-mono"
            variants={{
              rest: { opacity: 0.6, y: 0 },
              hover: { opacity: 1, y: 0 }
            }}
          >
            {title}
          </motion.p>
          
          {linkedinUrl && linkedinUrl !== '#' && (
            <motion.a 
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#0a66c2] transition-colors"
              variants={{
                rest: { opacity: 0, scale: 0.8 },
                hover: { opacity: 1, scale: 1 }
              }}
            >
              <LinkedinIcon size={18} />
            </motion.a>
          )}
        </div>

        {/* Title Stack (Slides up on hover) */}
        <motion.div 
          className="absolute left-0 right-0 z-10 flex flex-col items-start"
          variants={{
            rest: { top: '-20px' },
            hover: { top: '-56px' }
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Left Corner Cutout (Top Left of Title Stack) */}
          <SvgLeftCutout 
            className="w-5 h-5 ml-0" 
            style={{ color: bgColor }} 
          />
          
          <div 
            className="flex items-center px-6 pb-2 pt-2 h-9 w-full overflow-hidden"
            style={{ backgroundColor: bgColor }}
          >
            <motion.h3 
              className="text-white text-[1.05rem] sm:text-[1.15rem] leading-none font-bold tracking-tight uppercase truncate w-full"
              variants={{
                rest: { opacity: 0, filter: 'blur(4px)', y: 5 },
                hover: { opacity: 1, filter: 'blur(0px)', y: 0 }
              }}
              transition={{ duration: 0.2 }}
            >
              {name}
            </motion.h3>
          </div>
        </motion.div>
      </div>
      
      {/* Edge highlight / subtle inner border */}
      <div className="absolute inset-0 border border-white/5 rounded-t-2xl pointer-events-none z-30" />
    </motion.div>
  );
};

export default ProfileCard;