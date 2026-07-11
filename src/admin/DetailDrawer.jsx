import { useState } from "react";
import { motion } from "framer-motion";
import { db } from "../lib/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Trash2 } from "lucide-react";

const statusOptions = ["pending", "confirmed", "rejected"];

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
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-surface border-l border-white/10 z-50 overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Participant Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-bg rounded-lg p-4">
              <label className="text-gray-400 text-sm">Registration ID</label>
              <p className="text-white font-mono text-lg">{participant.regId}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-bg rounded-lg p-4">
                <label className="text-gray-400 text-sm">Full Name</label>
                <p className="text-white">{participant.name}</p>
              </div>
              <div className="bg-bg rounded-lg p-4">
                <label className="text-gray-400 text-sm">Team Name</label>
                <p className="text-white">{participant.teamName}</p>
              </div>
            </div>

            <div className="bg-bg rounded-lg p-4">
              <label className="text-gray-400 text-sm">Email</label>
              <p className="text-white">{participant.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-bg rounded-lg p-4">
                <label className="text-gray-400 text-sm">Phone</label>
                <p className="text-white">{participant.phone}</p>
              </div>
              <div className="bg-bg rounded-lg p-4">
                <label className="text-gray-400 text-sm">Track</label>
                <p className={`font-medium ${participant.track === "Software" ? "text-cyan-400" : "text-red-400"}`}>
                  {participant.track}
                </p>
              </div>
            </div>

            <div className="bg-bg rounded-lg p-4">
              <label className="text-gray-400 text-sm">Problem Statement</label>
              <div className="mt-1">
                <span className="inline-block px-2 py-0.5 bg-white/10 text-white/60 text-xs font-mono rounded mr-2">
                  {participant.problemStatementId}
                </span>
                <p className="text-white mt-1">{participant.problemStatement}</p>
              </div>
            </div>

            <div className="bg-bg rounded-lg p-4">
              <label className="text-gray-400 text-sm">College</label>
              <p className="text-white">{participant.college}</p>
            </div>

            {participant.members && participant.members.length > 0 && (
              <div className="bg-bg rounded-lg p-4">
                <label className="text-gray-400 text-sm mb-3 block">Team Members</label>
                <div className="space-y-3">
                  {participant.members.map((member, idx) => (
                    <div key={idx} className="border-t border-white/5 pt-3 first:border-t-0 first:pt-0">
                      <p className="text-white font-medium text-sm">Member {idx + 1}</p>
                      <div className="mt-1 space-y-1">
                        <p className="text-gray-300 text-sm">{member.name}</p>
                        <p className="text-gray-400 text-xs">{member.email}</p>
                        <p className="text-gray-400 text-xs">{member.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-bg rounded-lg p-4">
              <label className="text-gray-400 text-sm">Registration Date</label>
              <p className="text-white">
                {participant.createdAt?.toLocaleDateString() || "-"}
              </p>
            </div>

            <div className="bg-bg rounded-lg p-4">
              <label className="text-gray-400 text-sm">Status</label>
              <select
                value={participant.status || "pending"}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="mt-2 w-full px-3 py-2 bg-surface border border-white/10 rounded-lg text-white focus:border-primary focus:outline-none"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Delete Registration */}
            <div className="border-t border-white/10 pt-4">
              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Registration
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-red-400 text-sm text-center font-medium">
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
                      className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
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
