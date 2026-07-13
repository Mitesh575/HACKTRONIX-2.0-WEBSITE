import * as THREE from "three";
import { gsap } from "gsap";
import { QualityTier, QUALITY_PRESETS, TIMING } from "../transition.config.ts";
import { SingularityScene } from "./scene";

class PerformanceMonitor {
  private samples: number[] = [];
  private last: number = performance.now();
  private onDowngrade: (tier: QualityTier) => void;
  private currentTier: QualityTier;

  constructor(currentTier: QualityTier, onDowngrade: (tier: QualityTier) => void) {
    this.currentTier = currentTier;
    this.onDowngrade = onDowngrade;
  }

  public tick() {
    const now = performance.now();
    const dt = now - this.last;
    this.last = now;
    this.samples.push(dt);
    if (this.samples.length > 60) this.samples.shift();
    if (this.samples.length === 60) {
      const avg = this.samples.reduce((a, b) => a + b, 0) / 60;
      const fps = 1000 / avg;
      if (fps < 42 && this.currentTier !== "lite") {
        const nextTier = this.currentTier === "ultra" ? "balanced" : "lite";
        this.currentTier = nextTier;
        this.onDowngrade(nextTier);
        this.samples = [];
      }
    }
  }
}

interface EngineOptions {
  sceneCanvas: HTMLCanvasElement;
  distortCanvas: HTMLCanvasElement;
  tier: QualityTier;
  onTierDowngrade?: (tier: QualityTier) => void;
}

export function createEngine({
  sceneCanvas,
  distortCanvas,
  tier,
  onTierDowngrade,
}: EngineOptions) {
  let currentTier = tier;
  let preset = QUALITY_PRESETS[currentTier];
  let usePostDistortion = currentTier !== "lite";

  // Create Scene
  const sceneWrapper = new SingularityScene(
    sceneCanvas,
    distortCanvas,
    preset,
    usePostDistortion
  );

  // Dynamic overlays (created if they don't exist in DOM)
  let blackout = document.getElementById("blackout") as HTMLDivElement;
  if (!blackout) {
    blackout = document.createElement("div");
    blackout.id = "blackout";
    blackout.style.cssText = `
      position: fixed; inset: 0; background: #000; opacity: 0;
      z-index: 9999; pointer-events: none; transition: none;
    `;
    document.body.appendChild(blackout);
  }

  let liteOverlay = document.getElementById("lite-overlay") as HTMLDivElement;
  if (!liteOverlay && !usePostDistortion) {
    liteOverlay = document.createElement("div");
    liteOverlay.id = "lite-overlay";
    liteOverlay.style.cssText = `
      position: fixed; inset: 0; z-index: 9998; pointer-events: none; opacity: 0;
      background: radial-gradient(circle at var(--sx,50%) var(--sy,50%), #000 0%, transparent 55%);
    `;
    document.body.appendChild(liteOverlay);
  }

  // Performance Monitor
  const perfMonitor = new PerformanceMonitor(currentTier, (newTier) => {
    currentTier = newTier;
    preset = QUALITY_PRESETS[newTier];
    usePostDistortion = newTier !== "lite";
    sceneWrapper.rebuildFields(preset);

    if (onTierDowngrade) {
      onTierDowngrade(newTier);
    }

    // Add/remove liteOverlay based on tier
    if (!usePostDistortion && !document.getElementById("lite-overlay")) {
      liteOverlay = document.createElement("div");
      liteOverlay.id = "lite-overlay";
      liteOverlay.style.cssText = `
        position: fixed; inset: 0; z-index: 9998; pointer-events: none; opacity: 0;
        background: radial-gradient(circle at var(--sx,50%) var(--sy,50%), #000 0%, transparent 55%);
      `;
      document.body.appendChild(liteOverlay);
    }
  });

  // Render Loop
  const clock = new THREE.Clock();
  let animationFrameId: number;
  let active = false; // Start paused

  function animate() {
    if (!active) return;
    animationFrameId = requestAnimationFrame(animate);
    perfMonitor.tick();
    const t = clock.getElapsedTime();
    sceneWrapper.update(t);
  }

  function start() {
    if (active) return;
    active = true;
    clock.getDelta(); // Reset clock delta
    animate();
  }

  function stop() {
    active = false;
    cancelAnimationFrame(animationFrameId);
  }

  let activeTimeline: gsap.core.Timeline | null = null;

  return {
    start,
    stop,
    runFullTransition({
      x,
      y,
      onBlack,
    }: {
      x: number;
      y: number;
      onBlack: () => void;
    }) {
      start(); // Start rendering loop when transition begins
      if (activeTimeline) activeTimeline.kill();

      const worldPoint = sceneWrapper.screenToWorld(x, y);
      sceneWrapper.singularityWorld.copy(worldPoint);
      sceneWrapper.coreGroup.visible = true;

      // Handle Lite Overlay coordinates
      if (!usePostDistortion && liteOverlay) {
        const nx = (x / window.innerWidth) * 100;
        const ny = (y / window.innerHeight) * 100;
        liteOverlay.style.setProperty("--sx", nx + "%");
        liteOverlay.style.setProperty("--sy", ny + "%");
      }

      if (sceneWrapper.distortMat) {
        sceneWrapper.distortMat.uniforms.uCenter.value.set(
          x / window.innerWidth,
          1 - y / window.innerHeight
        );
      }

      // Environmental collapse targets: grab all images and data-collapse elements
      const allElements = Array.from(document.querySelectorAll("img, [data-collapse]"));
      
      const isInViewport = (el: Element) => {
        const rect = el.getBoundingClientRect();
        return (
          rect.bottom > 0 &&
          rect.right > 0 &&
          rect.top < window.innerHeight &&
          rect.left < window.innerWidth
        );
      };

      const collapseTargets = allElements.filter((el) => {
        if (!isInViewport(el)) return false;

        // Skip if an ancestor is also in the list and in the viewport to avoid double-animation
        let parent = el.parentElement;
        while (parent) {
          if (allElements.includes(parent) && isInViewport(parent)) {
            return false;
          }
          parent = parent.parentElement;
        }
        return true;
      });

      const collapseTimeline = gsap.timeline();
      collapseTargets.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const elCenterX = rect.left + rect.width / 2;
        const elCenterY = rect.top + rect.height / 2;
        const dx = x - elCenterX;
        const dy = y - elCenterY;

        collapseTimeline.to(
          el,
          {
            x: dx * 0.9,
            y: dy * 0.9,
            scale: 0.05,
            rotation: (i % 2 === 0 ? 1 : -1) * (40 + i * 15),
            opacity: 0,
            duration: TIMING.collapse,
            ease: "power3.in",
          },
          TIMING.click + TIMING.gravityAwaken * 0.5 + i * 0.03
        );
      });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: () => {
          onBlack();
        },
      });
      activeTimeline = tl;

      // Add collapse timeline in parallel
      tl.add(collapseTimeline, 0);

      // Phase 2 — Click: spawn micro singularity
      tl.to(
        {},
        {
          duration: TIMING.click,
          onUpdate: function () {
            sceneWrapper.coreScale = 0.02 * this.progress();
          },
        },
        0
      );

      // Phase 3 — Gravity awakens: particles begin spiraling in
      tl.to(
        {},
        {
          duration: TIMING.gravityAwaken,
          ease: "power3.in",
          onUpdate: function () {
            sceneWrapper.pullAmount = 0.55 * this.progress();
          },
        },
        TIMING.click
      );

      // Phase 4 — Space-time distortion ramps in
      tl.to(
        {},
        {
          duration: TIMING.distortionRamp,
          ease: "power2.inOut",
          onUpdate: function () {
            sceneWrapper.distortionStrength = 0.55 * this.progress() * preset.distortion;
            sceneWrapper.aberrationAmount = 0.006 * this.progress();
            if (!usePostDistortion && liteOverlay) {
              liteOverlay.style.opacity = (0.5 * this.progress()).toString();
            }
          },
        },
        TIMING.click + TIMING.gravityAwaken * 0.3
      );

      // Phase 5 — Event horizon: core expands
      tl.to(
        {},
        {
          duration: TIMING.eventHorizon,
          ease: "power2.in",
          onUpdate: function () {
            sceneWrapper.coreScale = 0.02 + 0.9 * this.progress();
            sceneWrapper.pullAmount = 0.55 + 0.4 * this.progress();
          },
        },
        TIMING.click + TIMING.gravityAwaken * 0.6
      );

      // Phase 7 — Camera movement: subtle zoom + shake
      tl.to(
        sceneWrapper.camera.position,
        {
          z: 6.4,
          duration: TIMING.cameraPunch,
          ease: "power2.in",
        },
        TIMING.click + TIMING.gravityAwaken
      );

      tl.to(
        {},
        {
          duration: TIMING.cameraPunch,
          onUpdate: function () {
            sceneWrapper.cameraShake = 0.03 * this.progress();
          },
          onComplete: () => {
            sceneWrapper.cameraShake = 0;
          },
        },
        TIMING.click + TIMING.gravityAwaken
      );

      // Phase 8 — Full screen consumption
      tl.to(
        {},
        {
          duration: 0.35,
          ease: "power4.in",
          onUpdate: function () {
            sceneWrapper.coreScale = 1 + this.progress() * 20;
            sceneWrapper.distortionStrength = 0.55 + 0.45 * this.progress();
          },
        },
        ">-0.1"
      );

      tl.to(
        blackout,
        {
          opacity: 1,
          duration: 0.3,
          ease: "power2.in",
        },
        "<"
      );

      tl.to({}, { duration: TIMING.blackHold }); // hold full black
    },

    runArrival({ onArrivalDone }: { onArrivalDone: () => void }) {
      if (activeTimeline) activeTimeline.kill();

      const tl = gsap.timeline({
        onComplete: () => {
          onArrivalDone();
          stop(); // Pause loop when animation finishes
        },
      });
      activeTimeline = tl;

      // Make sure blackout starts fully opaque
      gsap.set(blackout, { opacity: 1 });

      // Phase 10 — Arrival: reverse the anomaly, content settles, camera relaxes
      tl.to(blackout, { opacity: 0, duration: 0.4, ease: "power2.out" }, 0.05);

      tl.to(
        {},
        {
          duration: TIMING.arrivalOpen,
          ease: "power2.out",
          onUpdate: function () {
            const p = this.progress();
            sceneWrapper.coreScale = 20 * (1 - p);
            sceneWrapper.pullAmount = 0.95 * (1 - p);
            sceneWrapper.distortionStrength = 1 * (1 - p);
            sceneWrapper.aberrationAmount = 0.006 * (1 - p);
            if (!usePostDistortion && liteOverlay) {
              liteOverlay.style.opacity = (0.5 * (1 - p)).toString();
            }
          },
          onComplete: () => {
            sceneWrapper.coreGroup.visible = false;
          },
        },
        0.1
      );

      // Restore collapsed elements dynamically
      tl.to(
        "img, [data-collapse]",
        {
          opacity: 1,
          scale: 1,
          duration: TIMING.arrivalOpen * 0.8,
          ease: "power2.out",
          clearProps: "all",
        },
        0.1
      );

      tl.to(
        sceneWrapper.camera.position,
        {
          z: 8,
          duration: TIMING.arrivalOpen,
          ease: "power2.out",
        },
        0.1
      );
    },

    runReducedMotion({ onBlack }: { onBlack: () => void }) {
      if (activeTimeline) activeTimeline.kill();

      const tl = gsap.timeline({
        onComplete: () => {
          onBlack();
        },
      });
      activeTimeline = tl;

      tl.to("[data-collapse]", {
        opacity: 0,
        duration: 0.35,
        stagger: 0.03,
        ease: "power1.out",
      })
        .to(blackout, { opacity: 1, duration: 0.25 }, "<0.1")
        .to({}, { duration: TIMING.blackHold });
    },

    runReducedMotionArrival({ onArrivalDone }: { onArrivalDone: () => void }) {
      if (activeTimeline) activeTimeline.kill();

      const tl = gsap.timeline({
        onComplete: () => {
          onArrivalDone();
          stop();
        },
      });
      activeTimeline = tl;

      tl.to(blackout, { opacity: 0, duration: 0.4, ease: "power2.out" });
    },

    dispose() {
      stop();
      sceneWrapper.dispose();

      // Clean up dynamic elements if we created them
      if (blackout && blackout.parentNode) {
        blackout.parentNode.removeChild(blackout);
      }
      if (liteOverlay && liteOverlay.parentNode) {
        liteOverlay.parentNode.removeChild(liteOverlay);
      }
    },
  };
}
