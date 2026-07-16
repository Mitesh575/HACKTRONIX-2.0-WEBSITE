import { useState } from "react";
import { motion } from "framer-motion";
import { db } from "../lib/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Trash2 } from "lucide-react";

const statusOptions = ["pending", "confirmed", "rejected"];

const getDriveEmbedUrl = (url) => {
  if (!url) return null;
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return url;
};

export default function DetailDrawer({ participant, onClose, onDeleted }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleStatusChange = async (newStatus) => {
    try {
      const docRef = doc(db, "registrations", participant.id);
      await updateDoc(docRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "registrations", participant.id));
      onDeleted?.();
      onClose();
    } catch (error) {
      console.error("Error deleting registration:", error);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40"
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 h-full w-full max-w-md bg-black/90 backdrop-blur-2xl border-l border-white/10 z-[100] overflow-y-auto custom-scrollbar shadow-[-20px_0_40px_rgba(0,0,0,0.5)]"
      >
        <div className="p-6 pb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">Participant Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-8">
            
            {/* Header section with ID and Status */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex justify-between items-start">
              <div>
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1 block">Registration ID</label>
                <p className="text-white font-mono text-xl tracking-wide">{participant.regId}</p>
              </div>
              <div className="text-right">
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1 block">Status</label>
                <select
                  value={participant.status || "pending"}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded px-3 py-1.5 text-white text-sm font-medium focus:border-primary focus:outline-none cursor-pointer"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Team Info */}
            <div>
              <h3 className="text-xs font-semibold text-white/70 mb-3 uppercase tracking-wider">Team Information</h3>
              <div className="bg-white/5 border border-white/10 rounded-xl p-0 divide-y divide-white/10">
                <div className="p-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/40 text-[11px] font-semibold uppercase tracking-wider block mb-1">Team Name</label>
                    <p className="text-white font-medium">{participant.teamName}</p>
                  </div>
                  <div>
                    <label className="text-white/40 text-[11px] font-semibold uppercase tracking-wider block mb-1">Track</label>
                    <p className={`font-medium ${participant.track === "Software" ? "text-cyan-400" : "text-red-400"}`}>
                      {participant.track}
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <label className="text-white/40 text-[11px] font-semibold uppercase tracking-wider block mb-1">Problem Statement</label>
                  <div className="flex items-start gap-2 mt-1">
                    <span className="inline-block px-1.5 py-0.5 bg-white/10 text-white/80 text-xs font-mono rounded shrink-0 mt-0.5">
                      {participant.problemStatementId}
                    </span>
                    <p className="text-white text-sm leading-relaxed">{participant.problemStatement}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Leader Info */}
            <div>
              <h3 className="text-xs font-semibold text-white/70 mb-3 uppercase tracking-wider">Leader Details</h3>
              <div className="bg-white/5 border border-white/10 rounded-xl p-0 divide-y divide-white/10">
                <div className="p-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/40 text-[11px] font-semibold uppercase tracking-wider block mb-1">Full Name</label>
                    <p className="text-white">{participant.name}</p>
                  </div>
                  <div>
                    <label className="text-white/40 text-[11px] font-semibold uppercase tracking-wider block mb-1">Phone</label>
                    <p className="text-white">{participant.phone}</p>
                  </div>
                </div>
                <div className="p-4">
                  <label className="text-white/40 text-[11px] font-semibold uppercase tracking-wider block mb-1">Email</label>
                  <p className="text-white">{participant.email}</p>
                </div>
                <div className="p-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/40 text-[11px] font-semibold uppercase tracking-wider block mb-1">College</label>
                    <p className="text-white">{participant.college}</p>
                  </div>
                  {(participant.department || participant.type === 'internal') && (
                    <div>
                      <label className="text-white/40 text-[11px] font-semibold uppercase tracking-wider block mb-1">Department</label>
                      <p className="text-white">{participant.department || "N/A"}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Members Info */}
            {participant.members && participant.members.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-white/70 mb-3 uppercase tracking-wider">Team Members</h3>
                <div className="bg-white/5 border border-white/10 rounded-xl p-0 divide-y divide-white/10">
                  {participant.members.map((member, idx) => (
                    <div key={idx} className="p-4 grid grid-cols-2 gap-4 items-center">
                      <div>
                        <p className="text-white font-medium text-sm">{member.name}</p>
                        <p className="text-white/50 text-xs mt-0.5">{member.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/70 text-sm">{member.phone}</p>
                        {(member.department || participant.type === 'internal') && (
                          <p className="text-white/50 text-xs mt-0.5">{member.department || "N/A"}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata Info */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center">
              <div>
                <label className="text-white/40 text-[11px] font-semibold uppercase tracking-wider block mb-1">Registration Date & Time</label>
                <p className="text-white text-sm">
                  {participant.createdAt?.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }) || "-"}
                </p>
              </div>
            </div>

            {/* Presentation Document (PPT) */}
            {participant.pptUrl && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex flex-col">
                    <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">Presentation</h3>
                    {participant.pptName && (
                      <span className="text-[10px] text-white/40 mt-0.5 max-w-[200px] truncate" title={participant.pptName}>
                        {participant.pptName}
                      </span>
                    )}
                  </div>
                  <a
                    href={participant.pptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] uppercase tracking-wider text-[var(--neon-cyan)] hover:text-white transition-colors"
                  >
                    Open in New Tab ↗
                  </a>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-2 h-[400px]">
                  <iframe
                    src={getDriveEmbedUrl(participant.pptUrl)}
                    width="100%"
                    height="100%"
                    className="rounded-lg border-none"
                    allow="autoplay"
                    title="Presentation Preview"
                  ></iframe>
                </div>
                <p className="text-white/40 text-[10px] mt-2 text-center">
                  * Note: Google Drive files must have "Anyone with the link can view" permissions to display in this preview.
                </p>
              </div>
            )}

            {/* Delete Registration */}
            <div className="pt-2">
              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Registration
                </button>
              ) : (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <p className="text-red-400 text-sm text-center font-medium mb-4">
                    Are you sure? This cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
                    >
                      {deleting ? "Deleting..." : "Confirm Delete"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
