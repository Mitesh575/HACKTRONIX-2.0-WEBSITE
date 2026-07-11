import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Aperture, Bot, Download, LogOut, CheckCircle, XCircle, Trash2, ArrowLeft } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import hackLogo from "../images/hack-logo.png";
import { useRegistrations } from "../hooks/useRegistrations";
import StatCards from "./StatCards";
import ParticipantsTable from "./ParticipantsTable";
import DetailDrawer from "./DetailDrawer";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { doc, updateDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { db } from "../lib/firebase";

const sidebarItems = [
  { id: "overview", label: "Overview", icon: Aperture },
  { id: "participants", label: "Participants", icon: Bot },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkAction, setBulkAction] = useState(null); // 'confirm' | 'reject' | 'delete'
  const [bulkLoading, setBulkLoading] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { registrations, loading } = useRegistrations();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const handleExport = () => {
    const csvData = registrations.map((r) => ({
      "Reg ID": r.regId,
      "Name": r.name,
      "Email": r.email,
      "Phone": r.phone,
      "College": r.college,
      "Team Name": r.teamName,
      "Track": r.track,
      "Problem Statement": r.problemStatement || "",
      "Problem ID": r.problemStatementId || "",
      "Members": r.members?.map((m) => `${m.name} (${m.email}, ${m.phone})`).join(" | ") || "",
      "Status": r.status,
      "Date": r.createdAt?.toLocaleDateString() || "",
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `hacktronix_registrations_${new Date().toISOString().split("T")[0]}.csv`);
  };

  const handleToggleSelect = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback((ids) => {
    setSelectedIds((prev) => {
      const allSelected = ids.every((id) => prev.has(id));
      const next = new Set(prev);
      if (allSelected) {
        ids.forEach((id) => next.delete(id));
      } else {
        ids.forEach((id) => next.add(id));
      }
      return next;
    });
  }, []);

  const executeBulkAction = async () => {
    if (!bulkAction || selectedIds.size === 0) return;
    setBulkLoading(true);

    try {
      if (bulkAction === "delete") {
        const batch = writeBatch(db);
        selectedIds.forEach((id) => {
          batch.delete(doc(db, "registrations", id));
        });
        await batch.commit();
      } else {
        const newStatus = bulkAction === "confirm" ? "confirmed" : "rejected";
        const batch = writeBatch(db);
        selectedIds.forEach((id) => {
          batch.update(doc(db, "registrations", id), { status: newStatus });
        });
        await batch.commit();
      }
      setSelectedIds(new Set());
    } catch (error) {
      console.error("Bulk action error:", error);
    } finally {
      setBulkLoading(false);
      setBulkAction(null);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex">
      <aside className="w-64 bg-surface border-r border-white/10 p-4 flex flex-col">
        <Link to="/" className="flex flex-col items-center gap-2 mb-8 px-2 py-4 hover:opacity-80 transition-opacity">
          <img src={hackLogo} alt="HackTronix" className="w-16 h-auto object-contain drop-shadow-[0_0_10px_rgba(0,245,255,0.3)]" />
          <span className="text-xl font-bold text-white font-mono tracking-wider" style={{ fontFamily: "'Star Jedi', sans-serif" }}>
            Hack<span className="text-[var(--neon-cyan)]">Tronix</span>
          </span>
        </Link>

        <nav className="flex-1 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === item.id
                  ? "bg-primary/20 text-primary"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={handleExport}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors mb-2"
        >
          <Download className="w-5 h-5" />
          <span className="font-medium">Export CSV</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors mb-4"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>

        <div className="mt-auto border-t border-white/10 pt-4">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-gray-400 hover:text-[var(--neon-cyan)] transition-colors group cursor-target"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-xs uppercase tracking-wider">Back to Website</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-8">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="muted">
                  {registrations.length} total registration{registrations.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <StatCards registrations={registrations} />

            {/* Bulk Action Bar */}
            <AnimatePresence>
              {selectedIds.size > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 flex items-center gap-3 p-4 bg-surface border border-white/10 rounded-xl"
                >
                  <span className="text-white text-sm font-medium">
                    {selectedIds.size} selected
                  </span>
                  <div className="flex-1" />
                  <button
                    onClick={() => setBulkAction("confirm")}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-colors text-sm font-medium"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Confirm All
                  </button>
                  <button
                    onClick={() => setBulkAction("reject")}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30 transition-colors text-sm font-medium"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject All
                  </button>
                  <button
                    onClick={() => setBulkAction("delete")}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete All
                  </button>
                  <button
                    onClick={() => setSelectedIds(new Set())}
                    className="px-3 py-2 text-gray-400 hover:text-white text-sm"
                  >
                    Clear
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <ParticipantsTable
              registrations={registrations}
              onRowClick={setSelectedParticipant}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onSelectAll={handleSelectAll}
            />
          </>
        )}
      </main>

      {/* Detail Drawer */}
      <AnimatePresence>
        {selectedParticipant && (
          <DetailDrawer
            participant={selectedParticipant}
            onClose={() => setSelectedParticipant(null)}
            onDeleted={() => setSelectedParticipant(null)}
          />
        )}
      </AnimatePresence>

      {/* Bulk Action Confirmation Modal */}
      <AnimatePresence>
        {bulkAction && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBulkAction(null)}
              className="fixed inset-0 bg-black/60 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-surface border border-white/10 rounded-xl p-6 max-w-sm w-full">
                <h3 className="text-lg font-bold text-white mb-2">
                  {bulkAction === "delete"
                    ? "Delete Registrations"
                    : bulkAction === "confirm"
                    ? "Confirm Registrations"
                    : "Reject Registrations"}
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  {bulkAction === "delete"
                    ? `Permanently delete ${selectedIds.size} registration(s)? This cannot be undone.`
                    : `Update ${selectedIds.size} registration(s) to "${bulkAction === "confirm" ? "confirmed" : "rejected"}"?`}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setBulkAction(null)}
                    className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeBulkAction}
                    disabled={bulkLoading}
                    className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-50 ${
                      bulkAction === "delete"
                        ? "bg-red-600 hover:bg-red-700"
                        : bulkAction === "confirm"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-yellow-600 hover:bg-yellow-700"
                    }`}
                  >
                    {bulkLoading ? "Processing..." : "Confirm"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
