import { motion } from "framer-motion";
import Galaxy from "../components/Galaxy";
import TargetCursor from "../components/TargetCursor";
import ProfileCard from "../components/ui/ProfileCard";
import PrabhuImg from "../images/Prabhu.jpeg";
import SushmithaImg from "../images/Sushmitha.jpeg";
import VikashRajImg from "../images/VikashRaj.jpeg";
import MageshImg from "../images/Magesh.jpeg";
import ArunNehruImg from "../images/Arun Nehru.jpeg";
import MiteshKumarImg from "../images/Mitesh Kumar.jpeg";
import GopikaImg from "../images/Gopika.jpeg";
import DharshiniImg from "../images/Dharshini.jpeg";
import PriyaDharshiniImg from "../images/Priya Dharshini.jpeg";
import HariniImg from "../images/harini.jpeg";
import TimothyKelvinImg from "../images/Timothy Kelvin.jpeg";
import ShamKumaarImg from "../images/Sham Kumaar.jpeg";
import AshikaImg from "../images/Ashika.jpeg";
import BavyaImg from "../images/Bavya.jpeg";
import DSaiTejaswiniImg from "../images/D Sai Tejaswini.jpeg";
import DilliImg from "../images/Dilli.jpeg";
import SujayaImg from "../images/Sujaya Pon Gita P.jpeg";
import MuhilanImg from "../images/Muhilan.jpeg";
import GayathriImg from "../images/Gayathri.jpeg";
import SreeLekshmiImg from "../images/Sree Lekshmi J U.jpeg";
import ElginDaniImg from "../images/Elgin Dani.jpeg";
import SuyashImg from "../images/Suyash.jpeg";
import ArundhathiImg from "../images/Arundhathi Ramachandran.jpeg";
import SushilImg from "../images/Sushil Gopinath.jpeg";
import PavatharaniImg from "../images/Pavatharani Anandan.jpeg";
import ShawrouPrasathImg from "../images/SHAWROU PRASATH V.png";

const teamSections = [
  {
    title: "Core Organizing Committee",
    color: "from-red-500 to-orange-400",
    members: [
      { name: "Prabhu", role: "President", image: PrabhuImg, linkedinUrl: "https://www.linkedin.com/in/prabhu-s-b20018286/" },
      { name: "Sushmithaa R B", role: "Vice President", image: SushmithaImg, linkedinUrl: "https://www.linkedin.com/in/sushmithaa-balamurugan" },
    ],
  },
  {
    title: "Secretariat",
    color: "from-blue-500 to-cyan-400",
    members: [
      { name: "Vikash Raaj S", role: "Secretary", image: VikashRajImg, linkedinUrl: "https://www.linkedin.com/in/vikash-raaj-s-b191792a8" },
      { name: "Magesvaran B", role: "Operations Head", image: MageshImg, linkedinUrl: "https://www.linkedin.com/in/magesvaran-b-219064283" },
    ],
  },
  {
    title: "MTS Society",
    color: "from-blue-500 to-cyan-400",
    members: [
      { name: "Elgin Dani E", role: "Chairperson", image: ElginDaniImg, linkedinUrl: "https://www.linkedin.com/in/elgin-dani-11a52027b/" },
      { name: "Suyash B", role: "Vice Chairperson", image: SuyashImg, linkedinUrl: "https://www.linkedin.com/in/suyashb45/" },
    ],
  },
  {
    title: "Tech Domain",
    color: "from-purple-500 to-pink-400",
    members: [
      { name: "Arun Nehru", role: "Tech Head", image: ArunNehruImg, linkedinUrl: "https://www.linkedin.com/in/arun-nehru-nura14" },
      { name: "DILLI BASKARAN K", role: "Tech Associate", image: DilliImg, linkedinUrl: "https://www.linkedin.com/in/dilli-baskaran-k-1145952a0" },
      { name: "Mitesh Kumaar S", role: "Tech Associate", image: MiteshKumarImg, linkedinUrl: "https://www.linkedin.com/in/mitesh-kumaar-s-25329b378" },
      { name: "Gopika", role: "Tech Associate", image: GopikaImg, linkedinUrl: "https://www.linkedin.com/in/gopika-t-9ab453326/" },
    ],
  },
  {
    title: "Design Domain",
    color: "from-emerald-500 to-teal-400",
    members: [
      { name: "Sree Lekshmi J U", role: "Design Head", image: SreeLekshmiImg, nameSize: "16px", bgSize: "140%", bgPosition: "center center", linkedinUrl: "https://www.linkedin.com/in/sree-lekshmi-j-u-4b3678296/" },
      { name: "Dharshini S", role: "Design Vice Head", image: DharshiniImg, linkedinUrl: "https://www.linkedin.com/in/dharshini-s-624ab932a" },
      { name: "D Sai Tejaswini", role: "Design Associate", image: DSaiTejaswiniImg, linkedinUrl: "https://www.linkedin.com/in/darapureddy-sai-tejaswini-569303402" },
      { name: "SHAWROU PRASATH V", role: "Design Associate", image: ShawrouPrasathImg, nameSize: "15px", linkedinUrl: "https://www.linkedin.com/in/shawrou-prasath-v-45a18b328/" },
    ],
  },
  {
    title: "Content & Documentation",
    color: "from-amber-500 to-yellow-400",
    members: [
      { name: "MV PRIYADHARSHINI", role: "Content Head", image: PriyaDharshiniImg, linkedinUrl: "https://www.linkedin.com/in/priyadharshini-manivasahan-31a930292" },
      { name: "Harini S", role: "Content Associate", image: HariniImg, linkedinUrl: "https://www.linkedin.com/in/harinisivakumar06" },
      { name: "Sujaya Pon Gita P", role: "Content Associate", image: SujayaImg, bgSize: "115%" },
      { name: "Gayathri S", role: "Content Associate", image: GayathriImg, linkedinUrl: "https://www.linkedin.com/in/gayathri-s-692978327" },
    ],
  },
  {
    title: "Media & Marketing",
    color: "from-cyan-500 to-blue-400",
    members: [
      { name: "Muhilan", role: "Media Head", image: MuhilanImg, bgSize: "150%", bgPosition: "center center" },
      { name: "Timothy Kelvin M", role: "Media Associate", image: TimothyKelvinImg, linkedinUrl: "https://www.linkedin.com/in/timothy-kelvin-m-17b264284" },
      { name: "SHAMKUMAR V", role: "Media Associate", image: ShamKumaarImg, linkedinUrl: "https://www.linkedin.com/in/sham-kumar-0a135a340" },
    ],
  },
  {
    title: "Hosting Team",
    color: "from-rose-500 to-pink-400",
    members: [
      { name: "ARUNDHATHI H", role: "Hosting Head", image: ArundhathiImg, bgSize: "140%", bgPosition: "center 12%", linkedinUrl: "https://www.linkedin.com/in/arundhathi-ramachandran-6a84b8296/" },
      { name: "Sushil", role: "Hosting Vice Head", image: SushilImg, linkedinUrl: "https://www.linkedin.com/in/sushil-gopinath-b6248234a/" },
      { name: "Pavatharani A", role: "Hosting Associate", image: PavatharaniImg, bgSize: "140%", linkedinUrl: "https://www.linkedin.com/in/pavatharani-anandan-9001172b6/" },
      { name: "Gayathri", role: "Hosting Associate", image: GayathriImg, linkedinUrl: "https://www.linkedin.com/in/gayathri-s-692978327" },
      { name: "Ashika S Acharia", role: "Hosting Associate", image: AshikaImg, linkedinUrl: "https://www.linkedin.com/in/ashika-s-acharia-b85073332" },
      { name: "BAVYASREE K", role: "Hosting Associate", image: BavyaImg, linkedinUrl: "https://www.linkedin.com/in/bavyasree-k" },
    ],
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0.1) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const gradientMap = {
  "from-red-500 to-orange-400": "linear-gradient(145deg, rgba(239, 68, 68, 0.4) 0%, rgba(249, 115, 22, 0.3) 100%)",
  "from-blue-500 to-cyan-400": "linear-gradient(145deg, rgba(59, 130, 246, 0.4) 0%, rgba(34, 211, 238, 0.3) 100%)",
  "from-purple-500 to-pink-400": "linear-gradient(145deg, rgba(168, 85, 247, 0.4) 0%, rgba(236, 72, 153, 0.3) 100%)",
  "from-emerald-500 to-teal-400": "linear-gradient(145deg, rgba(16, 185, 129, 0.4) 0%, rgba(20, 184, 166, 0.3) 100%)",
  "from-amber-500 to-yellow-400": "linear-gradient(145deg, rgba(245, 158, 11, 0.4) 0%, rgba(250, 204, 21, 0.3) 100%)",
  "from-cyan-500 to-blue-400": "linear-gradient(145deg, rgba(6, 182, 212, 0.4) 0%, rgba(59, 130, 246, 0.3) 100%)",
  "from-rose-500 to-pink-400": "linear-gradient(145deg, rgba(244, 63, 94, 0.4) 0%, rgba(236, 72, 153, 0.3) 100%)",
};

function TeamCard({ member, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.06 }}
      className="w-full max-w-[320px] sm:w-[calc(50%-12px)] sm:max-w-[280px] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)]"
    >
      <ProfileCard
        avatarUrl={member.image}
        name={member.name}
        title={member.role}
        bgSize={member.bgSize}
        bgPosition={member.bgPosition}
        nameSize={member.nameSize}
        linkedinUrl={member.linkedinUrl}
      />
    </motion.div>
  );
}

export default function TeamPage() {
  return (
    <div className="relative min-h-screen">
      <TargetCursor variant="cyan" />
      <div className="fixed inset-0 -z-10 opacity-80">
        <Galaxy mouseInteraction={false} density={0.65} glowIntensity={0.2} saturation={0.08} />
      </div>

      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-black tracking-tight text-white md:text-7xl" style={{ fontFamily: "'Exo_2', sans-serif" }}>
              Meet the people behind <span className="text-[#ff2d55]">HackTronix</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-400">
              A passionate group of organizers, designers, and developers working together to deliver an unforgettable hackathon experience.
            </p>
          </motion.div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl space-y-20 px-4 pb-32 sm:px-6 lg:px-8">
        {teamSections.map((section, si) => (
          <section key={section.title}>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mb-8 text-2xl font-bold text-white md:text-3xl text-center font-['Exo_2']"
            >
              {section.title}
            </motion.h2>

            <div className="flex flex-wrap justify-center gap-6">
              {section.members.map((m, mi) => (
                <TeamCard key={`${section.title}-${m.name}`} member={m} gradient={section.color} index={mi} />
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}