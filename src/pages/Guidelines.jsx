import Galaxy from "../components/Galaxy";
import TargetCursor from "../components/TargetCursor";
import GlassCard from "../components/ui/GlassCard";

const generalRules = [
  "Each team must consist of a minimum of 2 members and a maximum of 4 members.",
  "Teams are allowed to select and work on only one problem statement.",
  "Inter-college teams: Allowed. Team members can be from the different colleges.",
  "Inter-specialization teams: Allowed. Team members can be from different specializations within the same college.",
  "All solutions must be submitted before the specified deadline.",
  "Any form of plagiarism will result in immediate disqualification of the team.",
  "At least two participants from the registered team must be physically present for the grand finale round.",
  "Mentors are not considered part of the team.",
  "Participants are responsible for the safety and security of their personal belongings.",
  "Participants must maintain cleanliness, follow a proper dress code, and uphold discipline at the venue.",
  "Travel expenses must be borne by the participants.",
  "The event will take place from 8:00 AM on August 6th to 3:00 PM on August 7th IST. Participants should plan accordingly.",
  "If the chosen problem statement requires hardware components, participants must bring their own as the organizing team will not provide any hardware.",
  "College students must bring their college ID card (a photocopy is acceptable) for verification at the grand finale.",
  "All project work must be completed during the Hackathon, and the code repository must be initialized at the start of the event.",
  "Teams are permitted to use libraries, frameworks, and open-source code, but pre-developed projects or open-sourced solutions specifically created for this event are not allowed.",
  "Product development must cease once the allotted time is over. Minor debugging and fixes are permitted post-deadline.",
  "The organizers reserve the right to disqualify any team for violating rules, displaying unsporting behavior, or breaching the code of conduct.",
  "The Hackathon judging criteria will be disclosed one hour before the event begins.",
  "In case of any disputes, the final decision will rest with the organizers.",
  "Participants must follow the official social media channels to stay updated and qualify for the grand finale.",
];

const hackTronixRules = [
  "Teams must upload the problem statement PPT and obtain approval during registration.",
  "Any form of plagiarism will lead to immediate disqualification.",
  "Sharing project-related information outside the team is strictly prohibited. Violations may result in disqualification.",
  "Teams or individuals may bring a faculty member (optional).",
  "Participants may select a mentor (optional).",
  "All project phases must be completed and submitted within the given deadlines.",
  "Communication must only occur via the registered email ID.",
  "From all registered teams, the top 30 teams will advance to the grand finale.",
  "Bonus points will be awarded for proper version control on GitHub.",
  "Teams must follow the provided PPT template for submissions.",
  "Participants must regularly check the Hacktronix 2.0 website for updates.",
  "Teams interested in donating their projects for public use are welcome to do so.",
];

const complianceRules = [
  "Failure to adhere to the above rules may result in warnings, penalties, or disqualification.",
  "The organizing committee reserves the right to modify the rules if necessary, with prior notification to the participants.",
  "Participants must acknowledge and accept these rules before registering for the event.",
];

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen">
      <TargetCursor variant="cyan" />
      <div className="fixed inset-0 -z-10 opacity-95" style={{ width: "100vw", height: "100vh" }}>
        <Galaxy mouseInteraction={false} density={0.65} glowIntensity={0.2} saturation={0.08} />
      </div>

      <main className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="section-badge mb-6">Rules</div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
            Guidelines
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-400">
            The following rules apply to all participants and teams. Please read them carefully before the event.
          </p>

          {/* Hacktronix 2.0 Rules Section */}
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-white tracking-widest uppercase font-mono border-l-4 border-cyan-500 pl-4">Hacktronix 2.0 Rules</h2>
            <GlassCard className="p-6 md:p-8 rounded-sm">
              <div className="space-y-4">
                {hackTronixRules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-4 group">
                    <span className="flex-shrink-0 w-8 h-8 rounded-sm bg-cyan-500/10 flex items-center justify-center text-xs font-bold text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors">{idx + 1}</span>
                    <p className="text-sm leading-7 text-gray-300 group-hover:text-white transition-colors">{rule}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* General Rules Section */}
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-bold text-white tracking-widest uppercase font-mono border-l-4 border-red-500 pl-4">General Rules</h2>
            <GlassCard className="p-6 md:p-8 rounded-sm">
              <div className="space-y-4">
                {generalRules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-4 group">
                    <span className="flex-shrink-0 w-8 h-8 rounded-sm bg-red-500/10 flex items-center justify-center text-xs font-bold text-red-500 border border-red-500/20 group-hover:bg-red-500/20 transition-colors">{idx + 1}</span>
                    <p className="text-sm leading-7 text-gray-300 group-hover:text-white transition-colors">{rule}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Compliance and Enforcement Section */}
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-bold text-white tracking-widest uppercase font-mono border-l-4 border-orange-500 pl-4">Compliance and Enforcement</h2>
            <GlassCard className="p-6 md:p-8 rounded-sm">
              <div className="space-y-4">
                {complianceRules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-4 group">
                    <span className="flex-shrink-0 w-8 h-8 rounded-sm bg-orange-500/10 flex items-center justify-center text-xs font-bold text-orange-500 border border-orange-500/20 group-hover:bg-orange-500/20 transition-colors">{idx + 1}</span>
                    <p className="text-sm leading-7 text-gray-300 group-hover:text-white transition-colors">{rule}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

        </div>
      </main>
    </div>
  );
}
