import { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ArrowLeft, Check, ChevronRight, ChevronDown, Bot, Terminal, Zap, Orbit, Plus, X, Upload } from "lucide-react";
import { db, storage } from "../lib/firebase";
import { sendConfirmationEmail } from "../lib/emailjs";
import GlassCard from "./ui/GlassCard";
import { problemStatements } from "../data/problemStatements";

const modalTheme = {
  neutral: {
    accent: "var(--neon-cyan)",
    accentBg: "rgba(0,245,255,0.12)",
    accentBorder: "rgba(0,245,255,0.3)",
    accentGlow: "rgba(0,245,255,0.15)",
    focusBorder: "var(--neon-cyan)",
    buttonClass: "btn-sw-primary",
    dotBg: "var(--neon-cyan)",
  },
  Software: {
    accent: "var(--neon-cyan)",
    accentBg: "rgba(0,245,255,0.12)",
    accentBorder: "rgba(0,245,255,0.3)",
    accentGlow: "rgba(0,245,255,0.15)",
    focusBorder: "var(--neon-cyan)",
    buttonClass: "btn-stormtrooper",
    dotBg: "var(--neon-cyan)",
  },
  Hardware: {
    accent: "var(--sw-red)",
    accentBg: "rgba(204,17,34,0.12)",
    accentBorder: "rgba(204,17,34,0.3)",
    accentGlow: "rgba(204,17,34,0.15)",
    focusBorder: "var(--sw-red)",
    buttonClass: "btn-vader",
    dotBg: "var(--sw-red)",
  },
};

const memberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
});

const registrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  college: z.string().min(2, "College name is required"),
  department: z.string().min(1, "Department is required"),
  otherDepartment: z.string().optional(),
  teamName: z.string().min(2, "Team name is required"),
  track: z.enum(["Software", "Hardware"], {
    errorMap: () => ({ message: "Please select a track" }),
  }),
  problemStatement: z.string().min(1, "Please select a problem statement"),
  problemStatementId: z.string().min(1, "Please select a problem statement"),
  pptFile: z.any().optional(),
  members: z.array(memberSchema).min(1, "At least 1 additional member required").max(4, "Maximum 4 additional members allowed"),
});

function ModalShell({ children, onClose, isDarkPopup }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    const el = modalRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      e.stopPropagation();
      const isAtTop = el.scrollTop <= 0;
      const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      const scrollingUp = e.deltaY < 0;
      const scrollingDown = e.deltaY > 0;
      if ((isAtTop && scrollingUp) || (isAtBottom && scrollingDown)) {
        e.preventDefault();
      }
    };

    const handleTouchMove = (e) => {
      e.stopPropagation();
      const isAtTop = el.scrollTop <= 0;
      const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      const scrollingUp = e.touches[0].clientY > (el._lastTouchY || 0);
      const scrollingDown = e.touches[0].clientY < (el._lastTouchY || 0);
      el._lastTouchY = e.touches[0].clientY;
      if ((isAtTop && scrollingUp) || (isAtBottom && scrollingDown)) {
        e.preventDefault();
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          ref={modalRef}
          className={`w-full max-w-5xl max-h-[90vh] overflow-y-auto overscroll-contain rounded-lg border transition-colors duration-500 sw-panel bg-[var(--sw-graphite)] border-[var(--sw-holo-bright)] shadow-[0_0_50px_rgba(0,245,255,0.15)] text-white`}
        >
          {/* Holographic background decoration */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          {children}
        </div>
      </motion.div>
    </>
  );
}

function StepBadge({ index, label, active, complete, isDarkPopup }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-md border text-sm font-semibold transition-all ${complete
            ? "bg-[var(--neon-cyan)] text-black border-[var(--neon-cyan)] shadow-[0_0_10px_var(--neon-cyan)]"
            : active
              ? "bg-transparent text-[var(--neon-cyan)] border-[var(--neon-cyan)] shadow-[inset_0_0_10px_rgba(0,245,255,0.2)]"
              : "border-white/10 bg-white/5 text-white/40"
          }`}
      >
        {complete ? <Check className="h-4 w-4" /> : index}
      </div>
      <span
        className={`text-sm font-bold tracking-wider font-mono uppercase ${active || complete
            ? "text-[var(--neon-cyan)]"
            : "text-white/40"
          }`}
      >
        {label}
      </span>
    </div>
  );
}

function TrackCard({ title, description, bullets, icon: Icon, active, onClick, isDarkPopup }) {
  return (
    <GlassCard
      as="button"
      type="button"
      onClick={onClick}
      className={`cursor-target group w-full p-6 text-left transition-all duration-300 sw-panel bg-[rgba(20,25,30,0.8)] border-[var(--sw-holo-bright)] text-white hover:shadow-[0_0_20px_rgba(0,245,255,0.2)] ${active
          ? "border-[var(--neon-cyan)] shadow-[0_0_20px_rgba(0,245,255,0.3)] bg-[rgba(0,245,255,0.1)]"
          : "hover:border-[var(--neon-cyan)]"
        }`}
      interactive
    >
      <div className="relative">
        <div className="mb-5 flex items-center justify-between">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-md border border-[var(--sw-holo-bright)] bg-black/50 text-[var(--neon-cyan)] shadow-[inset_0_0_10px_rgba(0,245,255,0.2)]`}
          >
            <Icon className="h-6 w-6" />
          </div>
          {active && (
            <div
              className={`rounded-md px-3 py-1 text-xs font-bold tracking-wider uppercase ${title === "Hardware" ? "bg-red-600 text-white" : "bg-[#00f5ff] text-black"
                }`}
            >
              Selected
            </div>
          )}
        </div>
        <h3 className={`mb-2 text-2xl font-semibold font-['Exo_2'] tracking-wide text-white`}>
          {title}
        </h3>
        <p className={`mb-5 text-sm leading-6 text-white/60`}>
          {description}
        </p>
        <div className="space-y-2">
          {bullets.map((bullet) => (
            <div key={bullet} className="flex items-center gap-2 text-sm">
              <span className={`h-1.5 w-1.5 rounded-sm ${isDarkPopup ? "bg-white" : "bg-black"}`} />
              {bullet}
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

function ProblemCard({ item, active, onSelect, isDarkPopup, track }) {
  const isRed = track === "Hardware";
  return (
    <GlassCard
      as="button"
      type="button"
      onClick={onSelect}
      className={`cursor-target group w-full p-5 text-left transition-all duration-300 sw-panel bg-[rgba(20,25,30,0.8)] border-[var(--sw-holo-bright)] text-white hover:shadow-[0_0_20px_rgba(0,245,255,0.2)] ${active
          ? "border-[var(--neon-cyan)] shadow-[0_0_20px_rgba(0,245,255,0.3)] bg-[rgba(0,245,255,0.1)]"
          : "hover:border-[var(--neon-cyan)]"
        }`}
      interactive
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div
            className={`mb-2 inline-flex rounded-md px-3 py-1 text-xs font-bold tracking-wide uppercase ${isRed ? "bg-red-600 text-white" : "bg-[#00f5ff] text-black"
              }`}
          >
            {item.id}
          </div>
          <h3 className={`text-lg font-semibold ${isDarkPopup ? "text-white" : "text-black"}`}>
            {item.title}
          </h3>
        </div>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md border transition-all ${active
            ? "bg-[var(--neon-cyan)] text-black border-[var(--neon-cyan)] shadow-[0_0_10px_var(--neon-cyan)]"
            : "border-white/10 bg-white/5 text-white/40"
            }`}
        >
          {active ? <Check className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </div>
      </div>
      <p className={`mb-4 text-sm leading-6 ${isDarkPopup ? "text-white/60" : "text-black/60"}`}>
        {item.summary}
      </p>
      <div className="flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className={`rounded-md px-3 py-1 text-[10px] uppercase font-bold tracking-wider ${isDarkPopup ? "bg-white/5 text-white/50" : "bg-black/5 text-black/50"
              }`}
          >
            {tag}
          </span>
        ))}
      </div>
    </GlassCard>
  );
}

function Field({ label, error, children, isDarkPopup }) {
  return (
    <div className="space-y-2 relative">
      <label className="sw-label block mb-1">
        {label}
      </label>
      {children}
      {error ? <p className="text-sm font-medium text-[var(--sw-red)] mt-1">{error}</p> : null}
    </div>
  );
}

function SummaryPill({ label, value, isDarkPopup, track }) {
  const isRed = track === "Hardware";
  return (
    <div
      className="rounded-md border p-4 md:p-5 sw-panel bg-[rgba(20,25,30,0.8)] border-[var(--sw-holo-bright)]"
    >
      <p
        className="mb-1 text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--neon-cyan)] opacity-70"
      >
        {label}
      </p>
      <p className="text-sm font-bold uppercase text-[var(--neon-cyan)]">
        {value}
      </p>
    </div>
  );
}

function MemberBlock({ index, error, theme, isDarkPopup, register }) {
  const inputClass = `w-full rounded-md border border-[var(--sw-holo-bright)] bg-black/40 px-4 py-3 font-mono text-sm text-[var(--neon-cyan)] outline-none transition-all placeholder-cyan-900/50 focus:border-[var(--neon-cyan)] focus:bg-[rgba(0,245,255,0.05)] focus:shadow-[0_0_15px_rgba(0,245,255,0.2)]`;

  return (
    <div
      className={`rounded-md border p-4 bg-[rgba(20,25,30,0.8)] border-[var(--sw-holo-bright)]`}
    >
      <div className="flex items-center justify-between mb-4">
        <h4
          className={`text-sm font-bold uppercase tracking-wider ${isDarkPopup ? "text-white" : "text-black"
            }`}
        >
          Member {index + 2}
        </h4>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-1">
          <label
            className="sw-label block mb-1"
          >
            Name
          </label>
          <input
            {...register(`members.${index}.name`)}
            className={inputClass}
            placeholder="Member name"
          />
          {error?.name?.message && (
            <p className="text-xs font-medium text-red-500">{error.name.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <label
            className="sw-label block mb-1"
          >
            Email
          </label>
          <input
            {...register(`members.${index}.email`)}
            type="email"
            className={inputClass}
            placeholder="Member email"
          />
          {error?.email?.message && (
            <p className="text-xs font-medium text-red-500">{error.email.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <label
            className="sw-label block mb-1"
          >
            Phone
          </label>
          <input
            {...register(`members.${index}.phone`)}
            type="tel"
            className={inputClass}
            placeholder="Member phone"
          />
          {error?.phone?.message && (
            <p className="text-xs font-medium text-red-500">{error.phone.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RegistrationModal({ isOpen, onClose, initialTrack = null }) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [regId, setRegId] = useState("");
  const [step, setStep] = useState("track");
  const [memberCount, setMemberCount] = useState(2);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      members: [
        { name: "", email: "", phone: "" },
        { name: "", email: "", phone: "" },
      ],
      track: undefined,
      problemStatement: "",
      problemStatementId: "",
    },
  });

  const selectedTrack = watch("track");
  const selectedDepartment = watch("department");
  const selectedProblemStatement = watch("problemStatement");
  const currentProblems = useMemo(
    () => (selectedTrack ? problemStatements[selectedTrack] : []),
    [selectedTrack]
  );

  useEffect(() => {
    if (!isOpen) {
      setSuccess(false);
      setRegId("");
      setStep(initialTrack ? "problem" : "track");
      setMemberCount(2);
      reset({
        name: "",
        email: "",
        phone: "",
        college: "",
        department: "",
        otherDepartment: "",
        teamName: "",
        members: [
          { name: "", email: "", phone: "" },
          { name: "", email: "", phone: "" },
        ],
        track: initialTrack || undefined,
        problemStatement: "",
        problemStatementId: "",
        pptFile: undefined,
      });
    }
  }, [isOpen, reset, initialTrack]);

  useEffect(() => {
    if (!isOpen) return;
    if (initialTrack) {
      setValue("track", initialTrack, { shouldDirty: false, shouldValidate: true });
      setStep("problem");
    } else {
      setStep("track");
    }
  }, [initialTrack, isOpen, setValue]);

  const chooseTrack = (track) => {
    setValue("track", track, { shouldDirty: true, shouldValidate: true });
    setValue("problemStatement", "", { shouldDirty: true, shouldValidate: false });
    setValue("problemStatementId", "", { shouldDirty: true, shouldValidate: false });
    setStep("problem");
  };

  const chooseProblemStatement = async (item) => {
    setValue("problemStatement", item.title, { shouldDirty: true, shouldValidate: true });
    setValue("problemStatementId", item.id, { shouldDirty: true, shouldValidate: true });
    await trigger(["track", "problemStatement", "problemStatementId"]);
    setStep("form");
  };

  const addMember = () => {
    if (memberCount < 4) {
      const newCount = memberCount + 1;
      setMemberCount(newCount);
      setValue(`members.${newCount - 1}`, { name: "", email: "", phone: "" });
    }
  };

  const removeMember = () => {
    if (memberCount > 2) {
      const newCount = memberCount - 1;
      setMemberCount(newCount);
      setValue(`members.${newCount}`, undefined);
    }
  };

  const [duplicateError, setDuplicateError] = useState("");

  const onSubmit = async (data) => {
    setSubmitting(true);
    setDuplicateError("");
    try {
      // Check for duplicate email
      const emailQuery = query(
        collection(db, "registrations"),
        where("email", "==", data.email)
      );
      const existing = await getDocs(emailQuery);
      if (!existing.empty) {
        setDuplicateError(`The email "${data.email}" is already registered. Each team lead can only register once.`);
        setSubmitting(false);
        return;
      }

      const generatedRegId = `HX${Date.now().toString(36).toUpperCase()}`;

      let pptUrl = "";
      if (data.pptFile && data.pptFile.length > 0 && storage) {
        const file = data.pptFile[0];
        const storageRef = ref(storage, `presentations/${generatedRegId}_${file.name}`);
        await uploadBytes(storageRef, file);
        pptUrl = await getDownloadURL(storageRef);
      }

      // Remove pptFile and otherDepartment from payload before saving
      const { pptFile, otherDepartment, department, ...submitData } = data;
      const finalDepartment = department === "Other" ? (otherDepartment || "Other") : department;

      await addDoc(collection(db, "registrations"), {
        ...submitData,
        department: finalDepartment,
        pptUrl,
        regId: generatedRegId,
        status: "pending",
        hackathonYear: "2.0",
        createdAt: serverTimestamp(),
      });

      sendConfirmationEmail({ ...submitData, regId: generatedRegId }).catch((e) =>
        console.warn("Email send failed:", e)
      );

      setRegId(generatedRegId);
      setSuccess(true);
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const stepNumber = step === "track" ? 1 : step === "problem" ? 2 : 3;
  const showTrackStep = !initialTrack;
  const theme = modalTheme[selectedTrack] || modalTheme.neutral;
  const isHardware = selectedTrack === "Hardware";
  const isDarkPopup = true; // Forced Dark Theme

  return (
    <AnimatePresence>
      {isOpen ? (
        <ModalShell onClose={onClose} isDarkPopup={isDarkPopup}>
          {success ? (
            <div className={`p-8 md:p-10 text-center ${isDarkPopup ? "text-white" : "text-black"}`}>
              <div
                className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-md text-green-400"
                style={{ backgroundColor: "rgba(34,197,94,0.15)" }}
              >
                <Check className="h-8 w-8" />
              </div>
              <h3 className={`mb-2 text-2xl font-bold ${isDarkPopup ? "text-white" : "text-black"}`}>Registration Successful</h3>
              <p className={`mb-4 ${isDarkPopup ? "text-gray-400" : "text-black/60"}`}>Your registration ID is</p>
              <p className="mb-6 text-2xl font-bold font-mono" style={{ color: theme.accent }}>
                {regId}
              </p>
              <p className={`mx-auto mb-8 max-w-md text-sm leading-6 ${isDarkPopup ? "text-gray-400" : "text-black/60"}`}>
                Save this ID for future reference. You can always replace the placeholder problem
                statements later.
              </p>
              <button onClick={onClose} className={`${theme.buttonClass} cursor-target text-sm`}>
                <span>Close</span>
              </button>
            </div>
          ) : (
            <div className="p-6 md:p-8">
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <div
                    className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wider mb-4 ${isHardware ? "!bg-red-600 !text-white" : "!bg-[#00f5ff] !text-black"
                      }`}
                  >
                    <Zap className="h-4 w-4" />
                    Team Registration
                  </div>
                  <h2
                    className={`text-2xl md:text-3xl font-black uppercase tracking-tight ${isDarkPopup ? "text-white" : "text-black"
                      }`}
                  >
                    Register for HACKTRONIX
                  </h2>
                  <p
                    className={`mt-2 max-w-2xl text-sm md:text-base font-medium ${isDarkPopup ? "text-white/60" : "text-black/60"
                      }`}
                  >
                    Pick your track, choose a domain, then complete your team
                    registration.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="cursor-target rounded-md border border-[var(--sw-holo-bright)] p-2 text-white/60 transition-all hover:bg-[rgba(0,245,255,0.1)] hover:text-[var(--neon-cyan)] hover:shadow-[0_0_15px_rgba(0,245,255,0.2)]"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-10 flex flex-wrap gap-6">
                {showTrackStep ? (
                  <StepBadge
                    index={1}
                    label="Track"
                    active={step === "track"}
                    complete={stepNumber > 1}
                    isDarkPopup={isDarkPopup}
                  />
                ) : null}
                <StepBadge
                  index={showTrackStep ? 2 : 1}
                  label="Domain"
                  active={step === "problem"}
                  complete={showTrackStep ? stepNumber > 2 : step === "form"}
                  isDarkPopup={isDarkPopup}
                />
                <StepBadge
                  index={showTrackStep ? 3 : 2}
                  label="Team Details"
                  active={step === "form"}
                  complete={false}
                  isDarkPopup={isDarkPopup}
                />
              </div>

              {showTrackStep && step === "track" ? (
                <div>
                  <div className="mb-6 max-w-2xl">
                    <h3
                      className={`text-xl font-black uppercase tracking-tight ${isDarkPopup ? "text-white" : "text-black"
                        }`}
                    >
                      Choose your track
                    </h3>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2 items-stretch">
                    <TrackCard
                      title="Software"
                      description="Ideal for teams building platforms, apps, AI tools, dashboards, and digital systems."
                      bullets={[
                        "Web or mobile products",
                        "AI-powered workflows",
                        "Platform and dashboard ideas",
                      ]}
                      icon={Terminal}
                      active={selectedTrack === "Software"}
                      onClick={() => chooseTrack("Software")}
                      isDarkPopup={isDarkPopup}
                    />
                    <TrackCard
                      title="Hardware"
                      description="Best for teams creating embedded, IoT, automation, robotics, or sensor-based solutions."
                      bullets={[
                        "Physical prototypes",
                        "Embedded and IoT systems",
                        "Automation and sensing",
                      ]}
                      icon={Bot}
                      active={selectedTrack === "Hardware"}
                      onClick={() => chooseTrack("Hardware")}
                      isDarkPopup={isDarkPopup}
                    />
                  </div>
                </div>
              ) : null}

              {step === "problem" ? (
                <div>
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3
                        className={`text-xl font-black uppercase tracking-tight ${isDarkPopup ? "text-white" : "text-black"
                          }`}
                      >
                        Choose a {selectedTrack} domain
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => (showTrackStep ? setStep("track") : onClose())}
                      className="cursor-target inline-flex items-center gap-2 rounded-md border border-[var(--sw-holo-bright)] bg-transparent px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--neon-cyan)] transition-all hover:bg-[rgba(0,245,255,0.1)] hover:shadow-[0_0_15px_rgba(0,245,255,0.2)]"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {showTrackStep ? "Back" : "Close"}
                    </button>
                  </div>

                  <div
                    className={`rounded-md border p-4 mb-6 ${isDarkPopup ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
                      }`}
                  >
                    <div
                      className={`inline-flex items-center gap-2 rounded-md px-3 py-1 text-xs font-bold uppercase tracking-widest ${isHardware ? "bg-red-600 text-white" : "bg-[#00f5ff] text-black"
                        }`}
                    >
                      {selectedTrack === "Software" ? (
                        <Terminal className="h-4 w-4" />
                      ) : (
                        <Orbit className="h-4 w-4" />
                      )}
                      {selectedTrack} Track
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 items-stretch">
                    {currentProblems.map((item) => (
                      <ProblemCard
                        key={item.id}
                        item={item}
                        active={selectedProblemStatement === item.title}
                        onSelect={() => chooseProblemStatement(item)}
                        isDarkPopup={isDarkPopup}
                        track={selectedTrack}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {step === "form" ? (
                <div>
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3
                        className={`text-xl font-black uppercase tracking-tight ${isDarkPopup ? "text-white" : "text-black"
                          }`}
                      >
                        Complete registration
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep("problem")}
                      className="cursor-target inline-flex items-center gap-2 rounded-md border border-[var(--sw-holo-bright)] bg-transparent px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--neon-cyan)] transition-all hover:bg-[rgba(0,245,255,0.1)] hover:shadow-[0_0_15px_rgba(0,245,255,0.2)]"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Change domain
                    </button>
                  </div>

                  <div className="mb-6 grid gap-4 md:grid-cols-2">
                    <SummaryPill
                      label="Selected track"
                      value={selectedTrack}
                      isDarkPopup={isDarkPopup}
                      track={selectedTrack}
                    />
                    <SummaryPill
                      label="Problem statement"
                      value={selectedProblemStatement}
                      isDarkPopup={isDarkPopup}
                      track={selectedTrack}
                    />
                  </div>

                  <div
                    className={`rounded-md border p-6 md:p-8 ${isDarkPopup
                      ? "bg-white/5 border-white/10 shadow-inner"
                      : "bg-black/5 border-black/10 shadow-inner"
                      }`}
                  >
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                      <input type="hidden" {...register("track")} />
                      <input type="hidden" {...register("problemStatement")} />
                      <input type="hidden" {...register("problemStatementId")} />

                      <div className="grid gap-6 md:grid-cols-2">
                        <Field
                          label="Full Name (Team Leader)"
                          error={errors.name?.message}
                          isDarkPopup={isDarkPopup}
                        >
                          <input
                            {...register("name")}
                            className="w-full rounded-md border border-[var(--sw-holo-bright)] bg-black/40 px-4 py-3 font-mono text-sm text-[var(--neon-cyan)] outline-none transition-all placeholder-cyan-900/50 focus:border-[var(--neon-cyan)] focus:bg-[rgba(0,245,255,0.05)] focus:shadow-[0_0_15px_rgba(0,245,255,0.2)]"
                            placeholder="Enter your full name"
                          />
                        </Field>
                        <Field label="Email Address (Team Leader)" error={errors.email?.message} isDarkPopup={isDarkPopup}>
                          <input
                            {...register("email")}
                            type="email"
                            className="w-full rounded-md border border-[var(--sw-holo-bright)] bg-black/40 px-4 py-3 font-mono text-sm text-[var(--neon-cyan)] outline-none transition-all placeholder-cyan-900/50 focus:border-[var(--neon-cyan)] focus:bg-[rgba(0,245,255,0.05)] focus:shadow-[0_0_15px_rgba(0,245,255,0.2)]"
                            placeholder="Enter your email"
                          />
                        </Field>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <Field
                          label="Phone Number (Team Leader)"
                          error={errors.phone?.message}
                          isDarkPopup={isDarkPopup}
                        >
                          <input
                            {...register("phone")}
                            type="tel"
                            className="w-full rounded-md border border-[var(--sw-holo-bright)] bg-black/40 px-4 py-3 font-mono text-sm text-[var(--neon-cyan)] outline-none transition-all placeholder-cyan-900/50 focus:border-[var(--neon-cyan)] focus:bg-[rgba(0,245,255,0.05)] focus:shadow-[0_0_15px_rgba(0,245,255,0.2)]"
                            placeholder="Enter phone number"
                          />
                        </Field>
                        <Field
                          label="College Name"
                          error={errors.college?.message}
                          isDarkPopup={isDarkPopup}
                        >
                          <input
                            {...register("college")}
                            className="w-full rounded-md border border-[var(--sw-holo-bright)] bg-black/40 px-4 py-3 font-mono text-sm text-[var(--neon-cyan)] outline-none transition-all placeholder-cyan-900/50 focus:border-[var(--neon-cyan)] focus:bg-[rgba(0,245,255,0.05)] focus:shadow-[0_0_15px_rgba(0,245,255,0.2)]"
                            placeholder="Enter college name"
                          />
                        </Field>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <Field
                          label="Department"
                          error={errors.department?.message}
                          isDarkPopup={isDarkPopup}
                        >
                          <div className="relative">
                            <select
                              {...register("department")}
                              className="w-full rounded-md border border-[var(--sw-holo-bright)] bg-black/40 px-4 py-3 font-mono text-sm text-[var(--neon-cyan)] outline-none transition-all appearance-none focus:border-[var(--neon-cyan)] focus:bg-[rgba(0,245,255,0.05)] focus:shadow-[0_0_15px_rgba(0,245,255,0.2)]"
                            >
                              <option value="">Select Department</option>
                              <option value="AI&DS">AI&DS</option>
                              <option value="CSE">CSE</option>
                              <option value="ECE">ECE</option>
                              <option value="AIML">AIML</option>
                              <option value="EEE">EEE</option>
                              <option value="MECH">MECH</option>
                              <option value="I&E">I&E</option>
                              <option value="MECH&AUTO">MECH&AUTO</option>
                              <option value="IOT">IOT</option>
                              <option value="CIVIL">CIVIL</option>
                              <option value="Cyber Security">Cyber Security</option>
                              <option value="M.TECH CSC">M.TECH CSC</option>
                              <option value="Other">Other</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                              <ChevronDown className="h-4 w-4 opacity-50" />
                            </div>
                          </div>
                        </Field>
                        {selectedDepartment === "Other" && (
                          <Field
                            label="Please Specify Department"
                            error={errors.otherDepartment?.message}
                            isDarkPopup={isDarkPopup}
                          >
                            <input
                              {...register("otherDepartment")}
                              className="w-full rounded-md border border-[var(--sw-holo-bright)] bg-black/40 px-4 py-3 font-mono text-sm text-[var(--neon-cyan)] outline-none transition-all placeholder-cyan-900/50 focus:border-[var(--neon-cyan)] focus:bg-[rgba(0,245,255,0.05)] focus:shadow-[0_0_15px_rgba(0,245,255,0.2)]"
                              placeholder="Enter your department"
                            />
                          </Field>
                        )}
                      </div>

                      <Field
                        label="Team Name"
                        error={errors.teamName?.message}
                        isDarkPopup={isDarkPopup}
                      >
                        <input
                          {...register("teamName")}
                          className="w-full rounded-md border border-[var(--sw-holo-bright)] bg-black/40 px-4 py-3 font-mono text-sm text-[var(--neon-cyan)] outline-none transition-all placeholder-cyan-900/50 focus:border-[var(--neon-cyan)] focus:bg-[rgba(0,245,255,0.05)] focus:shadow-[0_0_15px_rgba(0,245,255,0.2)]"
                          placeholder="Enter team name"
                        />
                      </Field>

                      <Field
                        label={
                          <>
                            PPT Upload{" "}
                            <a
                              href="https://docs.google.com/presentation/d/1QruGJ4kA4G-QTM7ozqO1cci-7jzy2mCEVwumGuRhrsE/edit?usp=sharing"
                              target="_blank"
                              rel="noreferrer"
                              className="text-[var(--neon-cyan)] hover:underline ml-1"
                            >
                              (PPT Template)
                            </a>
                          </>
                        }
                        error={errors.pptFile?.message}
                        isDarkPopup={isDarkPopup}
                      >
                        <div className="relative">
                          <input
                            {...register("pptFile")}
                            type="file"
                            accept=".ppt,.pptx,.pdf"
                            className="w-full rounded-md border border-[var(--sw-holo-bright)] bg-black/40 px-4 py-3 font-mono text-sm text-[var(--neon-cyan)] outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[var(--neon-cyan)] file:text-black hover:file:bg-cyan-400 focus:border-[var(--neon-cyan)] focus:shadow-[0_0_15px_rgba(0,245,255,0.2)]"
                          />
                        </div>
                      </Field>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label
                            className="sw-label block"
                          >
                            Team Members
                          </label>
                          <button
                            type="button"
                            onClick={addMember}
                            disabled={memberCount >= 4}
                            className="inline-flex items-center gap-1 rounded-md border border-[var(--sw-holo-bright)] bg-[rgba(0,245,255,0.1)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--neon-cyan)] transition-all hover:bg-[rgba(0,245,255,0.2)] disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add Member
                          </button>
                        </div>

                        {Array.from({ length: memberCount }).map((_, i) => (
                          <div key={i} className="relative">
                            <MemberBlock
                              index={i}
                              error={errors.members?.[i]}
                              theme={theme}
                              isDarkPopup={isDarkPopup}
                              register={register}
                            />
                            {i >= 1 && (
                              <button
                                type="button"
                                onClick={removeMember}
                                className="absolute top-3 right-3 p-1 rounded-md transition-all text-white/40 hover:text-[var(--sw-red)] hover:bg-[rgba(204,17,34,0.1)]"
                                title="Remove member"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {(errors.track || errors.problemStatement) && (
                        <div className="rounded-md border border-red-600 bg-red-600/10 px-4 py-3 text-sm font-bold text-red-600">
                          {errors.track?.message || errors.problemStatement?.message}
                        </div>
                      )}

                      {duplicateError && (
                        <div className="rounded-md border border-red-600 bg-red-600/10 px-4 py-3 text-sm font-bold text-red-600">
                          {duplicateError}
                        </div>
                      )}

                      <div
                        className={`flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between ${isDarkPopup ? "border-white/10" : "border-black/10"
                          }`}
                      >
                        <button
                          type="button"
                          onClick={() => (showTrackStep ? setStep("problem") : onClose())}
                          className="cursor-target inline-flex items-center justify-center gap-2 rounded-md border border-[var(--sw-holo-bright)] bg-transparent px-8 py-4 text-xs font-bold uppercase tracking-widest text-[var(--neon-cyan)] transition-all hover:bg-[rgba(0,245,255,0.1)] hover:shadow-[0_0_20px_rgba(0,245,255,0.2)]"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          {showTrackStep ? "Back" : "Close"}
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="cursor-target rounded-md px-10 py-4 text-xs font-bold uppercase tracking-widest transition-all bg-[var(--neon-cyan)] text-black hover:bg-[#00e5ff] shadow-[0_0_15px_var(--neon-cyan)] hover:shadow-[0_0_25px_var(--neon-cyan)] disabled:opacity-50"
                        >
                          {submitting ? "Submitting..." : "Submit Registration"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </ModalShell>
      ) : null}
    </AnimatePresence>
  );
}
