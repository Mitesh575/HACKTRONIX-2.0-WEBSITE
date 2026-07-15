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
    const csvData = registrations.map((r) => {
      const data = {
        "Reg ID": r.regId,
        "Team Name": r.teamName,
        "College": r.college,
        "Track": r.track,
        "Problem ID": r.problemStatementId || "",
        "Problem Statement": r.problemStatement || "",
        "Status": r.status,
        "Registration Date": r.createdAt ? new Date(r.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "",
        "Leader Name": r.name,
        "Leader Email": r.email,
        "Leader Phone": r.phone ? `'${r.phone}` : "",
        "Leader Department": r.department === "Other" && r.otherDepartment ? r.otherDepartment : (r.department || ""),
        "Leader Year": r.year || "",
      };

      for (let i = 0; i < 4; i++) {
        const m = r.members && r.members[i] ? r.members[i] : null;
        data[`Member ${i + 2} Name`] = m ? m.name : "";
        data[`Member ${i + 2} Email`] = m ? m.email : "";
        data[`Member ${i + 2} Phone`] = m ? `'${m.phone}` : "";
        data[`Member ${i + 2} Department`] = m ? m.department : "";
        data[`Member ${i + 2} Year`] = m ? m.year : "";
      }

      return data;
    });

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
    <div className="min-h-screen bg-[#050505] flex flex-col md:flex-row relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <aside className="w-full md:w-72 bg-white/[0.02] border-b md:border-b-0 md:border-r border-white/5 backdrop-blur-2xl p-4 md:p-6 flex flex-col md:h-screen relative z-10 overflow-y-auto custom-scrollbar">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
        <Link to="/" className="flex flex-row md:flex-col items-center gap-2 mb-6 md:mb-10 px-2 py-2 hover:scale-105 transition-transform relative z-10">
          <img src={hackLogo} alt="HackTronix" className="w-12 md:w-16 h-auto object-contain drop-shadow-[0_0_10px_rgba(0,245,255,0.3)]" />
          <span className="text-lg md:text-xl font-bold text-white font-mono tracking-wider" style={{ fontFamily: "'Star Jedi', sans-serif" }}>
            Hack<span className="text-[var(--neon-cyan)]">Tronix</span>
          </span>
        </Link>

        <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 mb-4 md:mb-0 md:flex-1 w-full">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-left transition-all duration-300 ${
                activeTab === item.id
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(0,245,255,0.1)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex flex-row md:flex-col gap-2 md:gap-0 mt-auto border-t border-white/5 pt-4 md:pt-6">
          <button
            onClick={handleExport}
            className="flex-1 md:w-full flex items-center justify-center md:justify-start gap-2 md:gap-4 px-3 md:px-5 py-2 md:py-3.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 md:mb-2 border border-transparent bg-white/5 md:bg-transparent"
          >
            <Download className="w-4 h-4 md:w-5 md:h-5" />
            <span className="font-medium text-sm md:text-base">Export</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex-1 md:w-full flex items-center justify-center md:justify-start gap-2 md:gap-4 px-3 md:px-5 py-2 md:py-3.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-300 md:mb-6 border border-transparent bg-white/5 md:bg-transparent"
          >
            <LogOut className="w-4 h-4 md:w-5 md:h-5" />
            <span className="font-medium text-sm md:text-base">Logout</span>
          </button>

          <Link
            to="/"
            className="flex-1 md:w-full flex items-center justify-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl text-gray-500 hover:text-[var(--neon-cyan)] transition-colors group bg-white/5 md:bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest font-semibold hidden md:inline">Back to Website</span>
            <span className="font-mono text-[10px] uppercase tracking-widest font-semibold md:hidden">Back</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-10 relative z-10 h-screen overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                  {activeTab === "overview" ? "Dashboard Overview" : "Participants Management"}
                </h1>
                <p className="text-white/50 text-sm font-medium">
                  {registrations.length} total registration{registrations.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {activeTab === "overview" && (
              <StatCards registrations={registrations} />
            )}

            {activeTab === "participants" && (
              <>
                {/* Bulk Action Bar */}
                <AnimatePresence>
                  {selectedIds.size > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 flex items-center gap-4 p-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white text-sm font-bold">
                        {selectedIds.size}
                      </div>
                      <span className="text-white/70 text-sm font-medium uppercase tracking-wider">
                        Selected
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
