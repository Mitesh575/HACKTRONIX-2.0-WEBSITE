import TargetCursor from "../components/TargetCursor";
import Galaxy from "../components/Galaxy";

export default function Results() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <TargetCursor variant="cyan" />
      <div className="fixed inset-0 -z-10 opacity-95" style={{ width: "100vw", height: "100vh" }}>
        <Galaxy mouseInteraction={false} density={0.65} glowIntensity={0.2} saturation={0.08} />
      </div>

      <main className="text-center px-4">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 font-['Exo_2'] tracking-widest uppercase">
          Results
        </h1>
        <p className="text-xl md:text-2xl text-[var(--neon-cyan)] font-mono tracking-widest">
          Coming soon...
        </p>
      </main>
    </div>
  );
}
