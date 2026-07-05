import { motion } from "framer-motion";
import { Bot, Target, Hourglass, Orbit } from "lucide-react";

const statCards = [
  { label: "Total Registered", value: "total", icon: Bot, color: "text-primary" },
  { label: "Confirmed", value: "confirmed", icon: Target, color: "text-green-500" },
  { label: "Pending", value: "pending", icon: Hourglass, color: "text-yellow-500" },
  { label: "Today's Signups", value: "today", icon: Orbit, color: "text-accent" },
];

function getStats(registrations) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const total = registrations.length;
  const confirmed = registrations.filter((r) => r.status === "confirmed").length;
  const pending = registrations.filter((r) => r.status === "pending").length;
  const todaySignups = registrations.filter((r) => {
    const createdAt = r.createdAt;
    return createdAt && createdAt >= today;
  }).length;

  const byDomain = registrations.reduce((acc, r) => {
    acc[r.domain] = (acc[r.domain] || 0) + 1;
    return acc;
  }, {});

  return { total, confirmed, pending, today: todaySignups, byDomain };
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Registered" icon={Bot} color="text-primary" count={stats.total} />
        <StatCard label="Confirmed" icon={Target} color="text-green-500" count={stats.confirmed} />
        <StatCard label="Pending" icon={Hourglass} color="text-yellow-500" count={stats.pending} />
        <StatCard label="Today's Signups" icon={Orbit} color="text-accent" count={stats.today} />
      </div>

      {Object.keys(stats.byDomain).length > 0 && (
        <div className="bg-surface border border-white/10 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">By Domain</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(stats.byDomain).map(([domain, count]) => (
              <span
                key={domain}
                className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
              >
                {domain}: {count}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
