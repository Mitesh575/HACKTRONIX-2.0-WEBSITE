import Hero from "../components/Hero";
import About from "../components/About";

import Prizes from "../components/Prizes";

import FAQ from "../components/FAQ";
import WhyJoinUs from "../components/WhyJoinUs";
import Timeline from "../components/Timeline";
import Sponsors from "../components/Sponsors";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Galaxy from "../components/Galaxy";
import TargetCursor from "../components/TargetCursor";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Lowest Layer: Particles (Galaxy) */}
      <div className="fixed inset-0 -z-30 opacity-60 pointer-events-none" style={{ width: "100vw", height: "100vh" }}>
        <Galaxy mouseInteraction={false} density={0.85} glowIntensity={0.2} saturation={0.1} />
      </div>

      <TargetCursor />
      <Hero />
      <div className="h-20 md:h-40" /> {/* Spacer after hero */}
      <About />


      <Prizes />

      <WhyJoinUs />
      <Sponsors />
      <Timeline />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
}
