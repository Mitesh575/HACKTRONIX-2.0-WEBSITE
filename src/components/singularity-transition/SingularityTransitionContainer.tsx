import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createEngine } from "./engine/engine";
import { detectInitialTier } from "./engine/transition.config";

export default function SingularityTransitionContainer() {
  const sceneCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const distortCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<any>(null);
  const isTransitioningRef = useRef<boolean>(false);
  const isReducedMotionRef = useRef<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const prevPathnameRef = useRef<string>(location.pathname);

  useEffect(() => {
    if (!sceneCanvasRef.current || !distortCanvasRef.current) return;

    try {
      // Initialize WebGL engine once on mount
      engineRef.current = createEngine({
        sceneCanvas: sceneCanvasRef.current,
        distortCanvas: distortCanvasRef.current,
        tier: detectInitialTier(),
      });
    } catch (err) {
      console.error("Failed to initialize singularity WebGL engine:", err);
      engineRef.current = null;
    }

    const handleTrigger = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { x, y, destination } = customEvent.detail;

      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      setVisible(true); // Make canvases visible

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      isReducedMotionRef.current = reduced;

      const onBlack = () => {
        // Phase 9: Navigate when blackout is complete
        navigate(destination);
      };

      try {
        if (reduced) {
          if (engineRef.current) {
            engineRef.current.runReducedMotion({ onBlack });
          } else {
            onBlack();
          }
        } else {
          if (engineRef.current) {
            engineRef.current.runFullTransition({ x, y, onBlack });
          } else {
            onBlack();
          }
        }
      } catch (err) {
        console.error("Singularity transition failed, fallback navigating immediately:", err);
        onBlack();
      }
    };

    window.addEventListener("trigger-singularity-transition", handleTrigger);

    return () => {
      window.removeEventListener("trigger-singularity-transition", handleTrigger);
      try {
        engineRef.current?.dispose();
      } catch (err) {
        console.error("Error disposing singularity engine:", err);
      }
    };
  }, [navigate]);

  // Listen to path changes to trigger arrival animation
  useEffect(() => {
    if (location.pathname !== prevPathnameRef.current) {
      prevPathnameRef.current = location.pathname;

      if (isTransitioningRef.current && engineRef.current) {
        const onArrivalDone = () => {
          isTransitioningRef.current = false;
          setVisible(false); // Hide canvases when transition completes
        };

        try {
          if (isReducedMotionRef.current) {
            engineRef.current.runReducedMotionArrival({ onArrivalDone });
          } else {
            engineRef.current.runArrival({ onArrivalDone });
          }
        } catch (err) {
          console.error("Arrival transition failed:", err);
          onArrivalDone();
        }
      }
    }
  }, [location.pathname]);

  return (
    <>
      <canvas
        id="bg-canvas"
        ref={sceneCanvasRef}
        className="fixed inset-0 w-full h-full block pointer-events-none"
        style={{ zIndex: -10, visibility: visible ? "visible" : "hidden" }}
      />
      <canvas
        id="distort-canvas"
        ref={distortRef => {
          distortCanvasRef.current = distortRef;
        }}
        className="fixed inset-0 w-full h-full block pointer-events-none"
        style={{ zIndex: -9, visibility: visible ? "visible" : "hidden" }}
      />
      <div
        id="blackout"
        className="fixed inset-0 bg-black opacity-0 pointer-events-none"
        style={{ zIndex: 9999, visibility: visible ? "visible" : "hidden" }}
      />
      <div
        id="quality-tag"
        className="fixed bottom-4 left-4 z-50 text-[10px] uppercase tracking-wider text-gray-600 pointer-events-none font-mono"
        style={{ visibility: visible ? "visible" : "hidden" }}
      />
    </>
  );
}
