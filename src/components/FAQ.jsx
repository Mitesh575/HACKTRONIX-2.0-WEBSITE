import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import GlassCard from "./ui/GlassCard";

const faqData = [
  {
    question: "What is HackTronix 2.0?",
    answer: "HackTronix 2.0 is an annual hackathon organized by HACKTRONIX where participants build innovative solutions across software and hardware tracks over a 48-hour period.",
  },
  {
    question: "Is it a remote or an on-site Hackathon?",
    answer: "The hackathon is a hybrid event. The main building phase can be done remotely, but at least two team members must be physically present for the grand finale round.",
  },
  {
    question: "Who can participate in the hackathon?",
    answer: "The hackathon is open to college students, professionals, and tech enthusiasts. There are no restrictions on educational background - anyone with a passion for building can participate.",
  },
  {
    question: "How many members are allowed in a team?",
    answer: "Each team must consist of a minimum of 2 members and a maximum of 4 members. Solo teams are not allowed for this edition.",
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
      answer: "No, all solutions must be developed during the hackathon. Teams are permitted to use libraries, frameworks, and open-source code, but pre-developed projects or open-sourced solutions specifically created for this event are not allowed.",
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
      answer: "Participants must bring their own laptop, hardware components (if required for their problem statement), and college ID card (a photocopy is acceptable) for verification at the grand finale.",
    },
    {
      question: "When should submissions be completed?",
      answer: "All solutions must be submitted before the specified deadline. Product development must cease once the allotted time is over. Minor debugging and fixes are permitted post-deadline.",
    },
    {
      question: "Will hardware be provided?",
      answer: "No, if the chosen problem statement requires hardware components, participants must bring their own as the organizing team will not provide any hardware.",
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
