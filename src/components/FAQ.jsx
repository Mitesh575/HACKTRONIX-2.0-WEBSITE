import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import GlassCard from "./ui/GlassCard";

const faqData = [
  {
    question: "What is HackTronix 2.0?",
    answer: "It's a 24-hour hackathon run by HACKTRONIX. You pick a problem statement, form a team, and build a working solution in software or hardware.",
  },
  {
    question: "Is it a remote or an on-site Hackathon?",
    answer: "It's hybrid. You can build your project remotely, but at least two team members need to show up in person for the grand finale.",
  },
  {
    question: "Who can participate in the hackathon?",
    answer: "College students, working professionals, anyone who likes building stuff. No specific background needed — just bring your skills and curiosity.",
  },
  {
    question: "How many members are allowed in a team?",
    answer: "Min 2, max 5 for external teams (max 3 for internal). No solo entries this time.",
  },
  {
    question: "Where to ask my question?",
    answer: "You can reach out to us through the Contact section, join our official social media channels, or email us at hacktronix@kiet.edu for any queries.",
  },
];

export default function FAQ({ isFullPage = false }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqItems = isFullPage ? [
    ...faqData,
    {
      question: "Can inter-college teams participate?",
      answer: "Yes, inter-college teams are allowed. Team members can be from different colleges.",
    },
    {
      question: "Can we choose more than one problem statement?",
      answer: "No, teams are allowed to select and work on only one problem statement.",
    },
    {
      question: "Are pre-built projects allowed?",
      answer: "No. You have to build everything during the hackathon. Using open-source libraries and frameworks is fine, but don't bring a pre-built project.",
    },
    {
      question: "What happens in case of plagiarism?",
      answer: "Any form of plagiarism will result in immediate disqualification of the team.",
    },
    {
      question: "Do we need to be present for the grand finale?",
      answer: "Yes, at least two participants from the registered team must be physically present for the grand finale round.",
    },
    {
      question: "What should participants bring?",
      answer: "Bring your laptop, any hardware parts your project needs, and your college ID (photocopy works too) for the finale.",
    },
    {
      question: "When should submissions be completed?",
      answer: "Everything has to be in before the deadline. Once time's up, stop building. Small bug fixes after that are okay.",
    },
    {
      question: "Will hardware be provided?",
      answer: "Nope. If your problem statement needs hardware, bring your own. We won't be providing any.",
    },
  ] : faqData;

  return (
    <section id="faq" className="py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />

      <div className="mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >

          <h2 className="mb-4 text-center text-3xl font-black tracking-tight text-white md:text-5xl">
            Frequently Asked <span className="text-[#ff2d55] font-['Exo_2']">Questions</span>
          </h2>
        </motion.div>

        <div className="mt-10 space-y-3">
          {faqItems.map((item, idx) => (
            <GlassCard key={idx} className="overflow-hidden rounded-xl">
              <button
                onClick={() => toggleAccordion(idx)}
                className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-white/[0.02]"
              >
                <span className="pr-4 text-base font-semibold text-white md:text-lg font-mono tracking-wide">
                  {item.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === idx ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="h-5 w-5 text-[var(--neon-cyan)]" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-white/6 px-5 pb-5 pt-4">
                      <p className="leading-relaxed text-gray-300 text-sm">{item.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          ))}
        </div>

        {!isFullPage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 text-center"
          >
            <Link
              to="/faq"
              className="btn-sw-secondary inline-flex items-center gap-2 cursor-target"
            >
              View All FAQs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
