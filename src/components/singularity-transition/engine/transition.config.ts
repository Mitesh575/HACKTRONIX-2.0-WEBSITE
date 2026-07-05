// transition.config.ts
// Single source of truth for the External Participation transition.
// Mirrors the CONFIG object in demo.html — keep the two in sync if you
// tune values in the demo before porting them back here.

export type QualityTier = "ultra" | "balanced" | "lite";

export interface QualityPreset {
    particles: number;
    dust: number;
    bloom: boolean;
    distortion: number; // 0..1 relative strength, ultra = 1.0 baseline
    dpr: number;
}

export const QUALITY_PRESETS: Record<QualityTier, QualityPreset> = {
    ultra: { particles: 700, dust: 260, bloom: true, distortion: 1.0, dpr: 2 },
    balanced: { particles: 220, dust: 90, bloom: false, distortion: 0.7, dpr: 1 },
    lite: { particles: 70, dust: 30, bloom: false, distortion: 0.35, dpr: 1 },
};

export const COLORS = {
    bgVoid: "#05060a",
    bgNavy: "#0a0e1c",
    bgGray: "#14151c",
    accentBlue: "#6c8cff",
    accentIndigo: "#4c5fd9",
    accentViolet: "#8b6cf6",
    starWhite: 0xeef1ff,
    blueWhite: 0x9db4ff,
    amber: 0xe8c07d,
};

// All durations in seconds. Total forward transition ≈ 2.9s before
// navigation fires; arrival reverse ≈ 1.1s. Tune here, not in the timeline.
export const TIMING = {
    hover: 0.2,
    click: 0.15,
    gravityAwaken: 0.6,
    distortionRamp: 0.9,
    eventHorizon: 0.6,
    collapse: 0.9,
    cameraPunch: 0.5,
    blackHold: 0.15,
    arrivalOpen: 1.1,
};

// Performance monitor thresholds — used by PerformanceMonitor to decide
// when to downgrade quality tier mid-session.
export const PERF = {
    sampleWindow: 60,       // frames averaged before evaluating
    downgradeFpsFloor: 42,  // drop a tier if rolling avg FPS falls below this
};

export function detectInitialTier(): QualityTier {
    if (typeof window === "undefined") return "balanced"; // SSR-safe default
    const cores = navigator.hardwareConcurrency || 4;
    // deviceMemory is non-standard / Chromium-only; guard access
    const mem = (navigator as any).deviceMemory || 4;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const hasWebGL = !!document.createElement("canvas").getContext("webgl");

    if (!hasWebGL) return "lite";
    if (!isMobile && cores >= 8 && mem >= 8) return "ultra";
    if (isMobile && cores >= 6 && mem >= 4) return "balanced";
    if (!isMobile) return "balanced";
    return "lite";
}
