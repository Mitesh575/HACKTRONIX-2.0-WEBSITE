import { useState, useMemo } from "react";
import { motion } from "framer-motion";

const ITEMS_PER_PAGE = 10;

const tracks = ["All", "Software", "Hardware"];
const statuses = ["All", "pending", "confirmed", "rejected"];

export default function ParticipantsTable({ registrations, onRowClick, selectedIds, onToggleSelect, onSelectAll }) {
  const [search, setSearch] = useState("");
  const [trackFilter, setTrackFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return registrations.filter((r) => {
      const q = search.toLowerCase();
      const matchesSearch =
        r.name?.toLowerCase().includes(q) ||
        r.teamName?.toLowerCase().includes(q) ||
        r.college?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.regId?.toLowerCase().includes(q);
      const matchesTrack = trackFilter === "All" || r.track === trackFilter;
      const matchesStatus = statusFilter === "All" || r.status === statusFilter;
      return matchesSearch && matchesTrack && matchesStatus;
    });
  }, [registrations, search, trackFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const allPageSelected = paginated.length > 0 && paginated.every((r) => selectedIds?.has(r.id));

  return (
    <div className="bg-surface border border-white/10 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/10 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name, team, college, email, or reg ID..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="flex-1 px-4 py-2 bg-bg border border-white/10 rounded-lg text-white focus:border-primary focus:outline-none"
        />
        <select
          value={trackFilter}
          onChange={(e) => {
            setTrackFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 bg-bg border border-white/10 rounded-lg text-white focus:border-primary focus:outline-none"
        >
          {tracks.map((t) => (
            <option key={t} value={t}>{t === "All" ? "All Tracks" : t}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 bg-bg border border-white/10 rounded-lg text-white focus:border-primary focus:outline-none"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>{s === "All" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-bg">
            <tr>
              {onToggleSelect && (
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    onChange={() => onSelectAll(paginated.map((r) => r.id))}
                    className="rounded border-white/20 bg-bg accent-primary cursor-pointer"
                  />
                </th>
              )}
              <th className="px-4 py-3 text-left text-gray-400 text-sm font-medium">Reg ID</th>
              <th className="px-4 py-3 text-left text-gray-400 text-sm font-medium">Name</th>
              <th className="px-4 py-3 text-left text-gray-400 text-sm font-medium">Team</th>
              <th className="px-4 py-3 text-left text-gray-400 text-sm font-medium">Track</th>
              <th className="px-4 py-3 text-left text-gray-400 text-sm font-medium">College</th>
              <th className="px-4 py-3 text-left text-gray-400 text-sm font-medium">Date</th>
              <th className="px-4 py-3 text-left text-gray-400 text-sm font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={onToggleSelect ? 8 : 7} className="px-4 py-8 text-center text-gray-500">
                  No registrations found
                </td>
              </tr>
            ) : (
              paginated.map((r, idx) => (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => onRowClick(r)}
                  className={`border-t border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${
                    selectedIds?.has(r.id) ? "bg-primary/10" : ""
                  }`}
                >
                  {onToggleSelect && (
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds?.has(r.id) || false}
                        onChange={() => onToggleSelect(r.id)}
                        className="rounded border-white/20 bg-bg accent-primary cursor-pointer"
                      />
                    </td>
                  )}
                  <td className="px-4 py-3 text-white font-mono text-sm">{r.regId}</td>
                  <td className="px-4 py-3 text-white">{r.name}</td>
                  <td className="px-4 py-3 text-gray-300">{r.teamName}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        r.track === "Software"
                          ? "bg-cyan-500/20 text-cyan-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {r.track}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300 truncate max-w-[150px]">{r.college}</td>
                  <td className="px-4 py-3 text-gray-400 text-sm">
                    {r.createdAt?.toLocaleDateString() || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        r.status === "confirmed"
                          ? "bg-green-500/20 text-green-400"
                          : r.status === "rejected"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {r.status || "pending"}
                    </span>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-gray-400 text-sm">
            Showing {(page - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-bg border border-white/10 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-bg border border-white/10 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
