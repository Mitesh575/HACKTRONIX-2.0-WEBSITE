import { Link } from "react-router-dom";
import { FileText, ArrowRight } from "lucide-react";
import hackLogo from "../images/hack-logo.png";

const quickLinks = [
  { label: "Team", href: "/team", icon: FileText },
  { label: "Guidelines", href: "/guidelines", icon: FileText },
  { label: "Code of Conduct", href: "https://drive.google.com/file/d/1dtxwRMXkn_2WIFh1QhknYb75QtFtFbOX/view", icon: FileText },
];

function InstagramIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TwitterIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedinIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function YoutubeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  );
}

const socialLinks = [
  { label: "Instagram", icon: InstagramIcon },
  { label: "Twitter", icon: TwitterIcon },
  { label: "LinkedIn", icon: LinkedinIcon },
  { label: "YouTube", icon: YoutubeIcon },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-[rgba(0,245,255,0.06)] overflow-hidden bg-[rgba(8,8,12,0.95)]">
      {/* Top holo line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(0,245,255,0.3)] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid md:grid-cols-3 gap-6 md:gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="cursor-target flex items-center gap-3 mb-4 group">
              <img src={hackLogo} alt="HackTronix 2.0" className="h-10 w-auto md:h-12 object-contain shrink-0" />
              <span className="text-xl font-bold text-white font-mono tracking-wider" style={{ fontFamily: "'Star Jedi', sans-serif" }}>
                Hack<span className="text-[var(--neon-cyan)]">Tronix 2.0</span>
              </span>
            </Link>
            <p className="muted text-sm leading-relaxed">
              The Ultimate Innovation Hackathon.<br />
              <span className="font-mono text-xs text-[var(--neon-cyan)] opacity-50">// BUILD &middot; CODE &middot; CONQUER</span>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 font-mono text-xs uppercase tracking-[0.2em]">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="cursor-target muted hover:text-[var(--neon-cyan)] transition-colors text-sm flex items-center gap-2 group font-mono"
                  >
                    <ArrowRight className="w-3 h-3 text-[var(--neon-cyan)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4 font-mono text-xs uppercase tracking-[0.2em]">Follow Us</h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href="#"
                    className="cursor-target w-10 h-10 rounded-lg border border-white/8 flex items-center justify-center hover:border-[rgba(0,245,255,0.3)] hover:bg-[rgba(0,245,255,0.06)] hover:shadow-[0_0_12px_rgba(0,245,255,0.15)] hover:scale-105 transition-all duration-300 group"
                    title={social.label}
                  >
                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-[var(--neon-cyan)] transition-colors duration-300" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/6 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="muted text-sm font-mono">
            &copy; 2026 <span className="text-[var(--neon-cyan)]">HACKTRONIX</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/admin/login"
              className="muted-2 text-xs font-mono hover:text-[var(--neon-cyan)] transition-colors cursor-target"
            >
              &gt; Developed by Dilli &amp; Mitesh_
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}