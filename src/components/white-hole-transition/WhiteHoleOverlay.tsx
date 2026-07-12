import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import html2canvas from "html2canvas";
import * as THREE from "three";
import { WHITE_HOLE_VERT, WHITE_HOLE_FRAG } from "./engine/shaders";

export default function WhiteHoleOverlay() {
  const [state, setState] = useState({
    phase: "IDLE",
    clickPosition: { x: 0, y: 0 },
    destination: ""
  });
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const handler = (e: any) => {
      setState({
        phase: "STARTING",
        clickPosition: { x: e.detail.x, y: e.detail.y },
        destination: e.detail.destination
      });
    };
    window.addEventListener("trigger-whitehole-transition", handler);
    return () => window.removeEventListener("trigger-whitehole-transition", handler);
  }, []);

  useEffect(() => {
    if (state.phase !== "STARTING") return;

    // Freeze scroll
    if ((window as any).__lenis) (window as any).__lenis.stop();

    const startTransition = async () => {
      if (!containerRef.current) return;

      const w = window.innerWidth;
      const h = window.innerHeight;
      
      // 1. Capture Page Background
      containerRef.current.style.opacity = "0";
      
      const canvasTex = await html2canvas(document.body, {
        scale: 0.25, // Lower scale for performance and natural blur during distortion
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#020408",
        width: document.documentElement.clientWidth,
        height: window.innerHeight,
        x: window.scrollX,
        y: window.scrollY,
        ignoreElements: (element) => {
          return element.id === "whitehole-overlay" || 
                 element.id === "singularity-overlay" ||
                 element.hasAttribute("data-wh-ignore");
        }
      });
      
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
        antialias: false,
        powerPreference: "high-performance"
      });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // 3. Setup Scene & Shader
      const quadScene = new THREE.Scene();
      const orthoCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      orthoCam.position.z = 1;
      
      const lensGeo = new THREE.PlaneGeometry(2, 2);
      const masterMat = new THREE.ShaderMaterial({
        vertexShader: WHITE_HOLE_VERT,
        fragmentShader: WHITE_HOLE_FRAG,
        uniforms: {
          uTex: { value: texture },
          uSingUV: { value: new THREE.Vector2(state.clickPosition.x / w, 1.0 - state.clickPosition.y / h) },
          uResolution: { value: new THREE.Vector2(w, h) },
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uCoreIntensity: { value: 0 },
          uWarpStrength: { value: 0 },
          uWhiteout: { value: 0 }
        },
        transparent: true
      });
      const quad = new THREE.Mesh(lensGeo, masterMat);
      quadScene.add(quad);

      // DOM Elements for GSAP Animation
      const titleLetters = document.querySelectorAll(".wh-letter");
      const cards = document.querySelectorAll(".wh-card");
      const navItems = document.querySelectorAll(".wh-nav");

      // Set initial 3D perspective on body for GSAP transforms
      gsap.set(document.body, { perspective: 1000 });

      // 4. GSAP Master Timeline
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onUpdate: () => {
            const time = tl.time();
            masterMat.uniforms.uTime.value = time;
            renderer.clear();
            renderer.render(quadScene, orthoCam);
          },
          onComplete: () => {
            // Cleanup
            renderer.dispose();
            masterMat.dispose();
            lensGeo.dispose();
            texture.dispose();
            if (canvas.parentNode) canvas.parentNode.removeChild(canvas);

            // Reset DOM element styles
            gsap.set([titleLetters, cards, navItems], { clearProps: "all" });
            gsap.set(document.body, { clearProps: "perspective" });

            if ((window as any).__lenis) (window as any).__lenis.start();
            setState(s => ({ ...s, phase: "IDLE" }));
          }
        });

        tlRef.current = tl;
        // Keep timeline moving fast to hit the 150ms-1200ms targets
        tl.timeScale(1.0); 

        // ═══ PHASE 1: Button Activation & Core Birth (0 → 0.15s) ═══
        // Tiny bright core appears behind the button
        tl.to(masterMat.uniforms.uCoreIntensity, {
          value: 0.2, duration: 0.15, ease: "power1.in"
        }, 0);
        tl.to(masterMat.uniforms.uProgress, {
          value: 0.05, duration: 0.15, ease: "power1.in"
        }, 0);

        // ═══ PHASE 2: White Hole Formation (0.15 → 0.5s) ═══
        // Expansion starts, pushing background texture outward
        tl.to(masterMat.uniforms.uCoreIntensity, {
          value: 1.0, duration: 0.35, ease: "power2.inOut"
        }, 0.15);
        tl.to(masterMat.uniforms.uProgress, {
          value: 0.3, duration: 0.35, ease: "power2.in"
        }, 0.15);
        tl.to(masterMat.uniforms.uWarpStrength, {
          value: 0.4, duration: 0.35, ease: "power2.in"
        }, 0.15);

        // ═══ PHASE 3: Reality Expansion (0.5 → 1.2s) ═══
        // Massive WebGL radial expansion
        tl.to(masterMat.uniforms.uProgress, {
          value: 2.5, duration: 0.7, ease: "power3.inOut"
        }, 0.5);
        tl.to(masterMat.uniforms.uWarpStrength, {
          value: 1.5, duration: 0.7, ease: "power3.in"
        }, 0.5);
        tl.to(masterMat.uniforms.uCoreIntensity, {
          value: 2.5, duration: 0.7, ease: "power3.in"
        }, 0.5);

        // DOM Explosions (0.5 → 1.2s)
        const clickX = state.clickPosition.x;
        const clickY = state.clickPosition.y;

        // Animate title letters outward
        titleLetters.forEach((letter) => {
          const rect = letter.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          // Vector from click to letter
          const dx = centerX - clickX;
          const dy = centerY - clickY;
          const dist = Math.sqrt(dx*dx + dy*dy);
          const dirX = dx / dist;
          const dirY = dy / dist;
          
          // Force is inversely proportional to distance
          const force = Math.max(100, 1000 - dist);
          
          tl.to(letter, {
            x: dirX * force,
            y: dirY * force,
            z: Math.random() * 500, // Move towards camera
            rotationX: Math.random() * 180 - 90,
            rotationY: Math.random() * 180 - 90,
            rotationZ: Math.random() * 90 - 45,
            opacity: 0,
            duration: 0.7,
            ease: "power2.in"
          }, 0.5);
        });

        // Animate Cards outward
        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const dx = centerX - clickX;
          const dy = centerY - clickY;
          const dist = Math.sqrt(dx*dx + dy*dy);
          const dirX = dx / dist;
          const dirY = dy / dist;
          
          const force = Math.max(200, 1200 - dist);
          
          tl.to(card, {
            x: dirX * force,
            y: dirY * force,
            z: Math.random() * 300 + 200,
            rotationX: Math.random() * 45 - 22.5,
            rotationY: Math.random() * 45 - 22.5,
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut"
          }, 0.4); // Start slightly earlier than letters
        });

        // Animate Navbar up and away
        navItems.forEach((nav, i) => {
          tl.to(nav, {
            y: -200,
            z: 100,
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
            delay: i * 0.05
          }, 0.6);
        });

        // ═══ PHASE 4: Whiteout Event (1.2 → 1.7s) ═══
        // Screen explodes into pure white bloom
        tl.to(masterMat.uniforms.uWhiteout, {
          value: 1.0, duration: 0.5, ease: "power4.in"
        }, 1.2);

        // Hide the original DOM completely once whiteout hits maximum
        tl.to(document.body, {
          opacity: 0, duration: 0.1
        }, 1.6);

        // Navigate under the cover of blinding light
        tl.call(() => {
          // Restore body opacity before navigation, but keep overlay visible
          gsap.set(document.body, { opacity: 1 });
          if (state.destination) {
            navigate(state.destination, { state: { fromWhiteHole: true } });
          }
        }, undefined, 1.7);

        // ═══ PHASE 5: Arrival & Dissolve (1.7 → 2.5s) ═══
        // The new page is now loaded behind the overlay.
        // We dissolve the white overlay to reveal the new page "assembling itself from energy".
        tl.to(masterMat.uniforms.uWhiteout, {
          value: 0.0, duration: 0.8, ease: "power2.out"
        }, 1.7);
        tl.to(masterMat.uniforms.uCoreIntensity, {
          value: 0.0, duration: 0.8, ease: "power2.out"
        }, 1.7);
        tl.to(containerRef.current, {
          opacity: 0, duration: 0.8, ease: "power2.out"
        }, 1.7);

        // Reset state and clear DOM styles after dissolve
        tl.call(() => {
          gsap.set(".wh-nav, .wh-letter, .wh-card", { clearProps: "all" });
          setState(prev => ({ ...prev, phase: "IDLE" }));
        }, undefined, 2.5);

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
      id="whitehole-overlay"
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 9000,
        backgroundColor: "transparent", 
        opacity: 0 // Start hidden for html2canvas
      }}
    >
      {/* WebGL Canvas mounts here */}
    </div>
  );
}
