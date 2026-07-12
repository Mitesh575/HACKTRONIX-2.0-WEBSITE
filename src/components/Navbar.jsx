import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import hackLogo from "../images/hack-logo.png";
import { useSingularityTransition } from "./singularity-transition/engine/useSingularityTransition";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { bind: transitionBind } = useSingularityTransition({
    destination: "/external-registration",
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Team", href: "/team" },
    { label: "Guidelines", href: "/guidelines" },
    { label: "FAQ", href: "/faq" },
    { label: "External Registration", href: "/external-registration" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-[rgba(10,10,14,0.88)] backdrop-blur-xl shadow-[0_0_30px_rgba(0,245,255,0.03)] border-b border-[rgba(0,245,255,0.06)]"
        : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-3 md:gap-6 relative">
          <Link to="/" className="cursor-target flex items-center gap-2 md:gap-3" data-collapse>
            <img
              id="nav-logo-slot"
              src={hackLogo}
              alt="HackTronix 2.0"
              className="h-16 w-auto md:h-20 shrink-0 object-contain"
            />
            <span className="text-white text-2xl md:text-4xl font-bold tracking-[0.08em]" style={{ fontFamily: "'Exo 2', sans-serif" }}>
              HACKTRONIX 2.0
            </span>
          </Link>

          <div className="flex-1 flex items-center justify-end h-full">
            {/* Desktop Links (Right Side) */}
            <div className="hidden md:flex items-center gap-2 md:translate-x-2">
              {navLinks.map((link, idx) => {
                const isExternal = link.href === "/external-registration";
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group"
                    data-collapse
                  >
                    <Link
                      to={link.href}
                      {...(isExternal ? transitionBind : {})}
                      className="cursor-target relative block px-4 py-2 text-red-600 hover:text-red-500 transition-all text-[11px] font-bold font-mono tracking-widest uppercase"
                    >
                      {link.label}
                      <span className="absolute bottom-1 left-4 right-4 h-px bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-[var(--neon-cyan)] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-collapse
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[rgba(10,10,14,0.95)] backdrop-blur-xl border-t border-white/6"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                const isExternal = link.href === "/external-registration";
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={(e) => {
                      setMobileOpen(false);
                      if (isExternal) {
                        transitionBind.onClick(e);
                      }
                    }}
                    className="block px-4 py-3 text-red-600 hover:text-red-400 hover:bg-white/5 rounded-sm transition-colors font-mono text-xs tracking-wider uppercase"
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

