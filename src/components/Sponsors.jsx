import { motion } from "framer-motion";
import LogoLoop from "./ui/LogoLoop";
import { 
  SiGooglegemini, SiClaude, SiAnthropic, SiMetaai, SiGithubcopilot,
  SiHuggingface, SiPerplexity, SiReplicate, SiMistralai, SiOpenaigym
} from 'react-icons/si';

const techRow1 = [
  { node: <SiGooglegemini />, title: "Gemini", href: "https://gemini.google.com" },
  { node: <SiClaude />, title: "Claude", href: "https://claude.ai" },
  { node: <SiAnthropic />, title: "Anthropic", href: "https://www.anthropic.com" },
  { node: <SiMetaai />, title: "Meta AI", href: "https://ai.meta.com" },
  { node: <SiGithubcopilot />, title: "GitHub Copilot", href: "https://copilot.github.com" },
];

const techRow2 = [
  { node: <SiHuggingface />, title: "Hugging Face", href: "https://huggingface.co" },
  { node: <SiPerplexity />, title: "Perplexity", href: "https://www.perplexity.ai" },
  { node: <SiReplicate />, title: "Replicate", href: "https://replicate.com" },
  { node: <SiMistralai />, title: "Mistral AI", href: "https://mistral.ai" },
  { node: <SiOpenaigym />, title: "OpenAI", href: "https://openai.com" },
];

export default function Sponsors() {
  return (
    <section id="sponsors" className="relative overflow-hidden py-12 md:py-20">
      <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute left-8 bottom-10 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute right-8 top-16 h-56 w-56 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">


        <div className="flex flex-col gap-10">
          <LogoLoop
            logos={techRow1}
            speed={40}
            direction="left"
            logoHeight={48}
            gap={64}
            hoverSpeed={10}
            scaleOnHover
            ariaLabel="Technology stack row 1"
          />
          <LogoLoop
            logos={techRow2}
            speed={35}
            direction="right"
            logoHeight={48}
            gap={64}
            hoverSpeed={10}
            scaleOnHover
            ariaLabel="Technology stack row 2"
          />
        </div>
      </div>
    </section>
  );
}
