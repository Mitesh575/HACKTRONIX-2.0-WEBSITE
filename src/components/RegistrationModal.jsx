import { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { ArrowLeft, Check, ChevronRight, Bot, Terminal, Zap, Orbit, Plus, X } from "lucide-react";
import { db } from "../lib/firebase";
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
  teamName: z.string().min(2, "Team name is required"),
  track: z.enum(["Software", "Hardware"], {
    errorMap: () => ({ message: "Please select a track" }),
  }),
  problemStatement: z.string().min(1, "Please select a problem statement"),
  problemStatementId: z.string().min(1, "Please select a problem statement"),
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
          className={`w-full max-w-5xl max-h-[90vh] overflow-y-auto overscroll-contain rounded-lg border transition-colors duration-500 ${
            isDarkPopup
              ? "bg-[#0a0a0e] border-white/10 text-white shadow-2xl shadow-black/80"
              : "bg-white border-black/10 text-black shadow-2xl shadow-black/30"
          }`}
        >
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
        className={`flex h-8 w-8 items-center justify-center rounded-md border text-sm font-semibold transition-all ${
          complete
            ? isDarkPopup
              ? "bg-white text-black border-white"
              : "bg-black text-white border-black"
            : active
            ? isDarkPopup
              ? "bg-white text-black border-white"
              : "bg-black text-white border-black"
            : isDarkPopup
            ? "border-white/10 bg-white/5 text-white/40"
            : "border-black/10 bg-black/5 text-black/40"
        }`}
      >
        {complete ? <Check className="h-4 w-4" /> : index}
      </div>
      <span
        className={`text-sm font-medium ${
          active || complete
            ? isDarkPopup
              ? "text-white"
              : "text-black"
            : isDarkPopup
            ? "text-white/40"
            : "text-black/40"
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
      className={`cursor-target group w-full p-6 text-left shadow-lg transition-all ${
        isDarkPopup
          ? "bg-white/5 border-white/10 text-white"
          : "bg-black/5 border-black/10 text-black"
      } ${
        active
          ? isDarkPopup
            ? "border-white bg-white/10"
            : "border-black bg-black/10"
          : isDarkPopup
          ? "hover:border-white/30"
          : "hover:border-black/30"
      }`}
      interactive
    >
      <div className="relative">
        <div className="mb-5 flex items-center justify-between">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-md ${
              isDarkPopup ? "bg-white text-black" : "bg-black text-white"
            }`}
          >
            <Icon className="h-6 w-6" />
          </div>
          {active && (
            <div
              className={`rounded-md px-3 py-1 text-xs font-bold tracking-wider uppercase ${
                title === "Hardware" ? "bg-red-600 text-white" : "bg-[#00f5ff] text-black"
              }`}
            >
              Selected
            </div>
          )}
        </div>
        <h3 className={`mb-2 text-2xl font-semibold ${isDarkPopup ? "text-white" : "text-black"}`}>
          {title}
        </h3>
        <p className={`mb-5 text-sm leading-6 ${isDarkPopup ? "text-white/60" : "text-black/60"}`}>
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
      className={`cursor-target group w-full p-5 text-left shadow-lg transition-all ${
        isDarkPopup
          ? "bg-white/5 border-white/10 text-white"
          : "bg-black/5 border-black/10 text-black"
      } ${
        active
          ? isDarkPopup
            ? "border-white bg-white/10"
            : "border-black bg-black/10"
          : isDarkPopup
          ? "hover:border-white/30"
          : "hover:border-black/30"
      }`}
      interactive
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div
            className={`mb-2 inline-flex rounded-md px-3 py-1 text-xs font-bold tracking-wide uppercase ${
              isRed ? "bg-red-600 text-white" : "bg-[#00f5ff] text-black"
            }`}
          >
            {item.id}
          </div>
          <h3 className={`text-lg font-semibold ${isDarkPopup ? "text-white" : "text-black"}`}>
            {item.title}
          </h3>
        </div>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md border transition-all ${
            active
              ? isDarkPopup
                ? "bg-white text-black border-white"
                : "bg-black text-white border-black"
              : isDarkPopup
              ? "border-white/10 bg-white/5 text-white/40"
              : "border-black/10 bg-black/5 text-black/40"
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
            className={`rounded-md px-3 py-1 text-[10px] uppercase font-bold tracking-wider ${
              isDarkPopup ? "bg-white/5 text-white/50" : "bg-black/5 text-black/50"
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
    <div className="space-y-2">
      <label
        className={`block text-sm font-bold uppercase tracking-wider ${
          isDarkPopup ? "text-white/60" : "text-black/60"
        }`}
      >
        {label}
      </label>
      {children}
      {error ? <p className="text-sm font-medium text-red-500">{error}</p> : null}
    </div>
  );
}

function SummaryPill({ label, value, isDarkPopup, track }) {
  const isRed = track === "Hardware";
  return (
    <div
      className={`rounded-md border p-4 md:p-5 ${
        isDarkPopup ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
      }`}
    >
      <p
        className={`mb-1 text-[10px] uppercase font-bold tracking-[0.2em] ${
          isDarkPopup ? "text-white/40" : "text-black/40"
        }`}
      >
        {label}
      </p>
      <p className={`text-sm font-bold uppercase ${isRed ? "text-red-600" : "text-[#00f5ff]"}`}>
        {value}
      </p>
    </div>
  );
}

function MemberBlock({ index, error, theme, isDarkPopup, register }) {
  const inputClass = `w-full rounded-md border px-4 py-3 font-medium outline-none transition-all ${
    isDarkPopup
      ? "border-white/10 bg-black text-white focus:border-white"
      : "border-black/10 bg-white text-black focus:border-black"
  }`;

  return (
    <div
      className={`rounded-md border p-4 ${
        isDarkPopup ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h4
          className={`text-sm font-bold uppercase tracking-wider ${
            isDarkPopup ? "text-white" : "text-black"
          }`}
        >
          Member {index + 2}
        </h4>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-1">
          <label
            className={`block text-xs font-bold uppercase tracking-wider ${
              isDarkPopup ? "text-white/50" : "text-black/50"
            }`}
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
            className={`block text-xs font-bold uppercase tracking-wider ${
              isDarkPopup ? "text-white/50" : "text-black/50"
            }`}
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
            className={`block text-xs font-bold uppercase tracking-wider ${
              isDarkPopup ? "text-white/50" : "text-black/50"
            }`}
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
        teamName: "",
        members: [
          { name: "", email: "", phone: "" },
          { name: "", email: "", phone: "" },
        ],
        track: initialTrack || undefined,
        problemStatement: "",
        problemStatementId: "",
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

      await addDoc(collection(db, "registrations"), {
        ...data,
        regId: generatedRegId,
        status: "pending",
        hackathonYear: "2.0",
        createdAt: serverTimestamp(),
      });

      sendConfirmationEmail({ ...data, regId: generatedRegId }).catch((e) =>
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
  const isDarkPopup = isHardware;

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
                    className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wider mb-4 ${
                      isHardware ? "!bg-red-600 !text-white" : "!bg-[#00f5ff] !text-black"
                    }`}
                  >
                    <Zap className="h-4 w-4" />
                    Team Registration
                  </div>
                  <h2
                    className={`text-2xl md:text-3xl font-black uppercase tracking-tight ${
                      isDarkPopup ? "text-white" : "text-black"
                    }`}
                  >
                    Register for HACKTRONIX
                  </h2>
                  <p
                    className={`mt-2 max-w-2xl text-sm md:text-base font-medium ${
                      isDarkPopup ? "text-white/60" : "text-black/60"
                    }`}
                  >
                    Pick your track, choose a domain, then complete your team
                    registration.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className={`cursor-target rounded-md border p-2 transition-all ${
                    isDarkPopup
                      ? "border-white/20 text-white hover:bg-white/10"
                      : "border-black/20 text-black hover:bg-black/10"
                  }`}
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
                      className={`text-xl font-black uppercase tracking-tight ${
                        isDarkPopup ? "text-white" : "text-black"
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
                        className={`text-xl font-black uppercase tracking-tight ${
                          isDarkPopup ? "text-white" : "text-black"
                        }`}
                      >
                        Choose a {selectedTrack} domain
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => (showTrackStep ? setStep("track") : onClose())}
                      className={`cursor-target inline-flex items-center gap-2 rounded-md border px-5 py-2 text-xs font-bold uppercase transition-all ${
                        isDarkPopup
                          ? "border-white/20 text-white hover:bg-white/5"
                          : "border-black/20 text-black hover:bg-black/5"
                      }`}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {showTrackStep ? "Back" : "Close"}
                    </button>
                  </div>

                  <div
                    className={`rounded-md border p-4 mb-6 ${
                      isDarkPopup ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
                    }`}
                  >
                    <div
                      className={`inline-flex items-center gap-2 rounded-md px-3 py-1 text-xs font-bold uppercase tracking-widest ${
                        isHardware ? "bg-red-600 text-white" : "bg-[#00f5ff] text-black"
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
                        className={`text-xl font-black uppercase tracking-tight ${
                          isDarkPopup ? "text-white" : "text-black"
                        }`}
                      >
                        Complete registration
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep("problem")}
                      className={`cursor-target inline-flex items-center gap-2 rounded-md border px-5 py-2 text-xs font-bold uppercase transition-all ${
                        isDarkPopup
                          ? "border-white/20 text-white hover:bg-white/5"
                          : "border-black/20 text-black hover:bg-black/5"
                      }`}
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
                    className={`rounded-md border p-6 md:p-8 ${
                      isDarkPopup
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
                            className={`w-full rounded-md border px-4 py-4 font-medium outline-none transition-all ${
                              isDarkPopup
                                ? "border-white/10 bg-black text-white focus:border-white"
                                : "border-black/10 bg-white text-black focus:border-black"
                            }`}
                            placeholder="Enter your full name"
                          />
                        </Field>
                        <Field label="Email Address (Team Leader)" error={errors.email?.message} isDarkPopup={isDarkPopup}>
                          <input
                            {...register("email")}
                            type="email"
                            className={`w-full rounded-md border px-4 py-4 font-medium outline-none transition-all ${
                              isDarkPopup
                                ? "border-white/10 bg-black text-white focus:border-white"
                                : "border-black/10 bg-white text-black focus:border-black"
                            }`}
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
                            className={`w-full rounded-md border px-4 py-4 font-medium outline-none transition-all ${
                              isDarkPopup
                                ? "border-white/10 bg-black text-white focus:border-white"
                                : "border-black/10 bg-white text-black focus:border-black"
                            }`}
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
                            className={`w-full rounded-md border px-4 py-4 font-medium outline-none transition-all ${
                              isDarkPopup
                                ? "border-white/10 bg-black text-white focus:border-white"
                                : "border-black/10 bg-white text-black focus:border-black"
                            }`}
                            placeholder="Enter college name"
                          />
                        </Field>
                      </div>

                      <Field
                        label="Team Name"
                        error={errors.teamName?.message}
                        isDarkPopup={isDarkPopup}
                      >
                        <input
                          {...register("teamName")}
                          className={`w-full rounded-md border px-4 py-4 font-medium outline-none transition-all ${
                            isDarkPopup
                              ? "border-white/10 bg-black text-white focus:border-white"
                              : "border-black/10 bg-white text-black focus:border-black"
                          }`}
                          placeholder="Enter team name"
                        />
                      </Field>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label
                            className={`block text-sm font-bold uppercase tracking-wider ${
                              isDarkPopup ? "text-white/60" : "text-black/60"
                            }`}
                          >
                            Team Members
                          </label>
                          <button
                            type="button"
                            onClick={addMember}
                            disabled={memberCount >= 4}
                            className={`inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-bold uppercase transition-all ${
                              isDarkPopup
                                ? "border-white/20 text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
                                : "border-black/20 text-black hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed"
                            }`}
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
                                className={`absolute top-3 right-3 p-1 rounded-md transition-all ${
                                  isDarkPopup
                                    ? "text-white/40 hover:text-red-400 hover:bg-white/10"
                                    : "text-black/40 hover:text-red-600 hover:bg-black/10"
                                }`}
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
                        className={`flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between ${
                          isDarkPopup ? "border-white/10" : "border-black/10"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => (showTrackStep ? setStep("problem") : onClose())}
                          className={`cursor-target inline-flex items-center justify-center gap-2 rounded-md border px-8 py-4 text-xs font-bold uppercase transition-all ${
                            isDarkPopup
                              ? "border-white/20 text-white hover:bg-white/5"
                              : "border-black/20 text-black hover:bg-black/5"
                          }`}
                        >
                          <ArrowLeft className="h-4 w-4" />
                          {showTrackStep ? "Back" : "Close"}
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className={`cursor-target rounded-md px-10 py-4 text-xs font-bold uppercase transition-all ${
                            isHardware
                              ? "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20"
                              : "bg-[#00f5ff] text-black hover:bg-cyan-400 shadow-lg shadow-cyan-500/20"
                          } disabled:opacity-50`}
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
