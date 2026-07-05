import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Aperture, Bot, Download, LogOut, Rocket } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useRegistrations } from "../hooks/useRegistrations";
import StatCards from "./StatCards";
import ParticipantsTable from "./ParticipantsTable";
import DetailDrawer from "./DetailDrawer";
import Papa from "papaparse";
import { saveAs } from "file-saver";

const sidebarItems = [
  { id: "overview", label: "Overview", icon: Aperture },
  { id: "participants", label: "Participants", icon: Bot },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedParticipant, setSelectedParticipant] = useState(null);
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
      "Members": r.members?.map((m) => m.name).join(", ") || "",
      "Status": r.status,
      "Date": r.createdAt?.toLocaleDateString() || "",
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "registrations.csv");
  };

  return (
    <div className="min-h-screen bg-bg flex">
      <aside className="w-64 bg-surface border-r border-white/10 p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg" />
          <span className="text-xl font-bold text-white">HACKTRONIX</span>
        </div>

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
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </aside>

      <main className="flex-1 p-8">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="muted">Welcome back! Here's your hackathon overview.</p>
            </div>
            <StatCards registrations={registrations} />
            <ParticipantsTable
              registrations={registrations}
              onRowClick={setSelectedParticipant}
            />
          </>
        )}
      </main>

      <AnimatePresence>
        {selectedParticipant && (
          <DetailDrawer
            participant={selectedParticipant}
            onClose={() => setSelectedParticipant(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
