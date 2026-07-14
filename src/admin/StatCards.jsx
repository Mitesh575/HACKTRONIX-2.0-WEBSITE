import { motion } from "framer-motion";
import { Bot, Target, Hourglass, Orbit, XCircle } from "lucide-react";

function getStats(registrations) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const total = registrations.length;
  const confirmed = registrations.filter((r) => r.status === "confirmed").length;
  const pending = registrations.filter((r) => r.status === "pending").length;
  const rejected = registrations.filter((r) => r.status === "rejected").length;
  const todaySignups = registrations.filter((r) => {
    const createdAt = r.createdAt;
    return createdAt && createdAt >= today;
  }).length;

  const byTrack = registrations.reduce((acc, r) => {
    if (r.track) {
      acc[r.track] = (acc[r.track] || 0) + 1;
    }
    return acc;
  }, {});

  return { total, confirmed, pending, rejected, today: todaySignups, byTrack };
}

function StatCard({ label, icon: Icon, color, bgClass, count }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden group hover:bg-white/10 transition-all duration-300"
    >
      {/* Subtle background glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${bgClass} rounded-full blur-[50px] opacity-10 -mr-10 -mt-10 transition-opacity group-hover:opacity-20`} />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <span className="text-white/60 text-[11px] font-semibold uppercase tracking-wider">{label}</span>
        <div className={`w-10 h-10 rounded-xl ${bgClass} bg-opacity-10 border border-white/5 flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <p className="text-4xl font-bold text-white relative z-10 tracking-tight">{count}</p>
    </motion.div>
  );
}

export default function StatCards({ registrations }) {
  const stats = getStats(registrations);

  return (
    <div className="mb-8">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatCard label="Total Registered" icon={Bot} color="text-indigo-400" bgClass="bg-indigo-500" count={stats.total} />
        <StatCard label="Confirmed" icon={Target} color="text-emerald-400" bgClass="bg-emerald-500" count={stats.confirmed} />
        <StatCard label="Pending" icon={Hourglass} color="text-amber-400" bgClass="bg-amber-500" count={stats.pending} />
        <StatCard label="Rejected" icon={XCircle} color="text-rose-400" bgClass="bg-rose-500" count={stats.rejected} />
        <StatCard label="Today's Signups" icon={Orbit} color="text-cyan-400" bgClass="bg-cyan-500" count={stats.today} />
      </div>

      {Object.keys(stats.byTrack).length > 0 && (
        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6">
          <h3 className="text-white/60 text-[11px] font-semibold uppercase tracking-wider mb-6">Registration By Track</h3>
          
          <div className="space-y-6">
            {Object.entries(stats.byTrack).map(([track, count]) => {
              const percentage = Math.round((count / stats.total) * 100) || 0;
              const isSoftware = track === "Software";
              const barColor = isSoftware ? "bg-cyan-500" : "bg-red-500";
              const textColor = isSoftware ? "text-cyan-400" : "text-red-400";
              
              return (
                <div key={track}>
                  <div className="flex justify-between items-end mb-2">
                    <span className={`text-sm font-semibold ${textColor} tracking-wide`}>{track}</span>
                    <div className="text-right">
                      <span className="text-white font-bold text-lg">{count}</span>
                      <span className="text-white/40 text-xs ml-2 font-medium">({percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-3 overflow-hidden border border-white/5 shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full ${barColor} relative`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full h-full -skew-x-12 animate-[shimmer_2s_infinite]"></div>
                    </motion.div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  );
}
