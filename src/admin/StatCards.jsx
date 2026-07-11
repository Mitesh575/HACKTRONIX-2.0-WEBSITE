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

function StatCard({ label, icon: Icon, color, count }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border border-white/10 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400 text-sm">{label}</span>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <p className={`text-3xl font-bold ${color}`}>{count}</p>
    </motion.div>
  );
}

export default function StatCards({ registrations }) {
  const stats = getStats(registrations);

  return (
    <div className="mb-8">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Registered" icon={Bot} color="text-primary" count={stats.total} />
        <StatCard label="Confirmed" icon={Target} color="text-green-500" count={stats.confirmed} />
        <StatCard label="Pending" icon={Hourglass} color="text-yellow-500" count={stats.pending} />
        <StatCard label="Rejected" icon={XCircle} color="text-red-500" count={stats.rejected} />
        <StatCard label="Today's Signups" icon={Orbit} color="text-accent" count={stats.today} />
      </div>

      {Object.keys(stats.byTrack).length > 0 && (
        <div className="bg-surface border border-white/10 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">By Track</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(stats.byTrack).map(([track, count]) => (
              <span
                key={track}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  track === "Software"
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {track}: {count}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
