import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import html2canvas from "html2canvas";
import * as THREE from "three";
import { HyperspaceScene } from "./engine/HyperspaceScene";
import { GARGANTUA_VERT, GARGANTUA_FRAG } from "./engine/shaders";

export default function SingularityOverlay() {
  const [state, setState] = useState({
    phase: "IDLE",
    clickPosition: { x: 0, y: 0 },
    destination: ""
  });
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement>(null);
  const canvas2dRef = useRef<HTMLCanvasElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const handler = (e: any) => {
      setState({
        phase: "STARTING",
        clickPosition: { x: e.detail.x, y: e.detail.y },
        destination: e.detail.destination
      });
    };
    window.addEventListener("trigger-singularity-transition", handler);
    return () => window.removeEventListener("trigger-singularity-transition", handler);
  }, []);

  useEffect(() => {
    if (state.phase !== "STARTING") return;

    // Freeze scroll
    if ((window as any).__lenis) (window as any).__lenis.stop();

    const startTransition = async () => {
      if (!containerRef.current || !canvas2dRef.current) return;

      const w = window.innerWidth;
      const h = window.innerHeight;
      
      // 1. Capture Page Screenshot
      // Hide the overlay temporarily so we don't screenshot the overlay itself if it's visible
      containerRef.current.style.opacity = "0";
      
      const isMobile = window.innerWidth < 768 || navigator.maxTouchPoints > 0;
      let canvasTex;

      if (isMobile) {
        // Fallback for mobile: skip heavy DOM screenshot, use a solid dark background
        const dummyCanvas = document.createElement("canvas");
        dummyCanvas.width = 16;
        dummyCanvas.height = 16;
        const ctx = dummyCanvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#020408";
          ctx.fillRect(0, 0, 16, 16);
        }
        canvasTex = dummyCanvas;
      } else {
        canvasTex = await html2canvas(document.body, {
          scale: 0.25, // Significantly reduced for near-instant capture since it will be distorted anyway
          useCORS: true,
          allowTaint: false, // Prevent WebGL SecurityError from tainted canvas
          backgroundColor: "#020408",
          width: document.documentElement.clientWidth,
          height: window.innerHeight,
          x: window.scrollX,
          y: window.scrollY,
          ignoreElements: (element) => element.id === "singularity-overlay"
        });
      }
      
      containerRef.current.style.opacity = "1";

      const texture = new THREE.CanvasTexture(canvasTex);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      const canvas = document.createElement("canvas");
      canvas.style.position = "absolute";
      canvas.style.inset = "0px";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.zIndex = "1";
      containerRef.current.appendChild(canvas);

      // 2. Setup Three.js WebGL
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: false, // For performance
        powerPreference: "high-performance"
      });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // 3. Setup Scenes
      // A) Master Gargantua Quad
      const quadScene = new THREE.Scene();
      const orthoCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      orthoCam.position.z = 1;
      
      const lensGeo = new THREE.PlaneGeometry(2, 2);
      const masterMat = new THREE.ShaderMaterial({
        vertexShader: GARGANTUA_VERT,
        fragmentShader: GARGANTUA_FRAG,
        uniforms: {
          uTex: { value: texture },
          uSingUV: { value: new THREE.Vector2(state.clickPosition.x / w, 1.0 - state.clickPosition.y / h) },
          uResolution: { value: new THREE.Vector2(w, h) },
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uDiskIntensity: { value: 0 },
          uWarpStrength: { value: 0 },
          uAlpha: { value: 1.0 }
        },
        transparent: true
      });
      const quad = new THREE.Mesh(lensGeo, masterMat);
      quadScene.add(quad);

      // B) Hyperspace Scene (tunnel)
      const hsScene = new HyperspaceScene(w, h);

      // 4. GSAP Master Timeline — SMOOTH FLOW
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onUpdate: () => {
            const time = tl.time();
            masterMat.uniforms.uTime.value = time;
            hsScene.uniforms.uTime.value = time;

            renderer.autoClear = false;
            renderer.clear();
            renderer.render(quadScene, orthoCam);

            hsScene.update(gsap.ticker.deltaRatio() * 16 / 1000);
            if (hsScene.uniforms.uOpacity.value > 0) {
              renderer.clearDepth();
              renderer.render(hsScene.scene, hsScene.camera);
            }
          },
          onComplete: () => {
            // Cleanup WebGL resources
            renderer.dispose();
            masterMat.dispose();
            lensGeo.dispose();
            texture.dispose();
            if (canvas.parentNode) canvas.parentNode.removeChild(canvas);

            if ((window as any).__lenis) (window as any).__lenis.start();
            setState(s => ({ ...s, phase: "IDLE" }));
          }
        });

        tlRef.current = tl;
        tl.timeScale(1.8);

        // ═══ PHASE 1: Subtle gravity stir (0 → 1.0s) ═══
        // Gentle introduction — the page barely breathes inward
        tl.to(masterMat.uniforms.uWarpStrength, {
          value: 0.15, duration: 1.0, ease: "sine.inOut"
        }, 0);
        tl.to(masterMat.uniforms.uProgress, {
          value: 0.08, duration: 1.0, ease: "sine.inOut"
        }, 0);

        // ═══ PHASE 2: Gravity awakens (0.6 → 1.8s) ═══
        // Overlaps with Phase 1 for continuity — no hard cuts
        tl.to(masterMat.uniforms.uWarpStrength, {
          value: 0.5, duration: 1.2, ease: "power1.in"
        }, 0.6);
        tl.to(masterMat.uniforms.uProgress, {
          value: 0.3, duration: 1.2, ease: "power1.in"
        }, 0.6);

        // ═══ PHASE 3: Accretion disk ignites (1.2 → 2.4s) ═══
        // Disk fades in gently while the black hole continues growing
        tl.to(masterMat.uniforms.uDiskIntensity, {
          value: 1.0, duration: 1.2, ease: "sine.inOut"
        }, 1.2);
        tl.to(masterMat.uniforms.uProgress, {
          value: 0.6, duration: 1.2, ease: "sine.in"
        }, 1.2);
        tl.to(masterMat.uniforms.uWarpStrength, {
          value: 0.85, duration: 1.2, ease: "sine.in"
        }, 1.2);

        // ═══ PHASE 4: Event horizon consumes (2.0 → 3.2s) ═══
        // Smooth acceleration into full blackness
        tl.to(masterMat.uniforms.uProgress, {
          value: 8.0, duration: 1.2, ease: "power2.in"
        }, 2.0);
        tl.to(masterMat.uniforms.uWarpStrength, {
          value: 1.0, duration: 0.8, ease: "sine.in"
        }, 2.0);

        // Navigate when screen is completely consumed (pure black)
        tl.call(() => {
          if (state.destination) {
            if (state.destination.startsWith("http")) {
              window.location.href = state.destination;
            } else {
              navigate(state.destination, { state: { fromSingularity: true } });
            }
          }
        }, undefined, 2.8);

        // ═══ PHASE 5: Wormhole entry (3.0 → 3.8s) ═══
        // Hyperspace fades in smoothly while disk fades out
        tl.to(masterMat.uniforms.uDiskIntensity, {
          value: 0.0, duration: 0.6, ease: "sine.out"
        }, 3.0);
        tl.to(hsScene.uniforms.uOpacity, {
          value: 1.0, duration: 0.6, ease: "sine.inOut"
        }, 3.0);
        tl.to(hsScene.uniforms.uSpeed, {
          value: 0.4, duration: 0.8, ease: "sine.in"
        }, 3.0);

        // ═══ PHASE 6: Hyperspace cruise (3.6 → 4.6s) ═══
        tl.to(hsScene.uniforms.uSpeed, {
          value: 1.2, duration: 1.0, ease: "sine.inOut"
        }, 3.6);

        // ═══ PHASE 7: Deceleration & gentle exit (4.4 → 5.4s) ═══
        // Instead of an abrupt flash, we decelerate and dissolve
        tl.to(hsScene.uniforms.uSpeed, {
          value: 0.1, duration: 1.0, ease: "power2.out"
        }, 4.4);
        tl.to(hsScene.uniforms.uOpacity, {
          value: 0.0, duration: 1.0, ease: "sine.inOut"
        }, 4.4);

        // Gentle white glow (not a harsh flash)
        tl.to(canvas2dRef.current, {
          opacity: 0.6,
          duration: 0.6,
          ease: "sine.in",
          onUpdate: function() {
            const ctx2 = canvas2dRef.current?.getContext("2d");
            if (!ctx2) return;
            const w2 = canvas2dRef.current!.width;
            const h2 = canvas2dRef.current!.height;
            const op = parseFloat(this.targets()[0].style.opacity) || 0;

            ctx2.clearRect(0, 0, w2, h2);
            const grd = ctx2.createRadialGradient(w2/2, h2/2, 0, w2/2, h2/2, w2 * 0.7);
            grd.addColorStop(0, `rgba(255, 255, 255, ${op * 0.7})`);
            grd.addColorStop(0.4, `rgba(0, 245, 255, ${op * 0.3})`);
            grd.addColorStop(1, `rgba(2, 4, 8, 0)`);
            ctx2.fillStyle = grd;
            ctx2.fillRect(0, 0, w2, h2);
          }
        }, 4.6);

        // ═══ PHASE 8: Page reveal dissolve (5.0 → 6.2s) ═══
        // Smooth fade of the entire overlay to reveal the destination page
        tl.to(canvas2dRef.current, {
          opacity: 0, duration: 0.8, ease: "sine.out"
        }, 5.0);
        tl.to(containerRef.current, {
          opacity: 0, duration: 1.2, ease: "sine.inOut"
        }, 5.0);
      }, containerRef);
    };

    startTransition();

    return () => {
      if (tlRef.current) tlRef.current.kill();
    };
  }, [state.phase, state.destination, state.clickPosition, navigate]);

  if (state.phase === "IDLE") return null;

  return (
    <div
      id="singularity-overlay"
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 9000,
        backgroundColor: "#020408", // Void background
        opacity: 0 // Start hidden so html2canvas can capture without a black flash
      }}
    >
      {/* 2D Layer for Light Burst */}
      <canvas
        ref={canvas2dRef}
        className="absolute inset-0 w-full h-full opacity-0"
        style={{ zIndex: 2 }}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  );
};
