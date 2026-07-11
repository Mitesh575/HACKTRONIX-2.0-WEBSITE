import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import hackLogo from "../images/hack-logo.png";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate("/admin");
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4 relative">
      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-[var(--neon-cyan)] transition-colors group cursor-target"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-mono text-sm uppercase tracking-wider">Back to Website</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-surface border border-white/10 rounded-2xl p-8 shadow-[0_0_40px_rgba(0,245,255,0.05)] relative overflow-hidden">
          {/* Subtle glow effect inside the box */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[var(--neon-cyan)] opacity-10 blur-[50px] rounded-full pointer-events-none" />

          <div className="text-center mb-8 relative z-10">
            <img src={hackLogo} alt="HackTronix" className="h-20 w-auto mx-auto mb-4 object-contain drop-shadow-[0_0_15px_rgba(0,245,255,0.3)]" />
            <h1 className="text-2xl font-bold text-white font-mono uppercase tracking-wider" style={{ fontFamily: "'Star Jedi', sans-serif" }}>
              Admin <span className="text-[var(--neon-cyan)]">Login</span>
            </h1>
            <p className="text-gray-400 text-sm mt-2 font-mono">AUTHORIZED PERSONNEL ONLY</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-bg border border-white/10 rounded-lg text-white focus:border-primary focus:outline-none"
                placeholder="admin@hacktronix.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-bg border border-white/10 rounded-lg text-white focus:border-primary focus:outline-none"
                placeholder="Enter password"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-gray-500 text-xs text-center mt-6 font-mono uppercase tracking-widest opacity-50">
            Secure connection established
          </p>
        </div>
      </motion.div>
    </div>
  );
}
