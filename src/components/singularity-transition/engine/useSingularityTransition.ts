// useSingularityTransition.ts
// Production integration hook for React Router. Dispatches a custom event
// to coordinate the transition with the global SingularityTransitionContainer.

import { useCallback, useRef } from "react";
import { TIMING } from "./transition.config.ts";

interface Options {
    destination: string;
    onPhaseChange?: (phase: string) => void;
}

export function useSingularityTransition({ destination, onPhaseChange }: Options) {
    const sceneCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const distortCanvasRef = useRef<HTMLCanvasElement | null>(null);

    const runTransition = useCallback(
        (clientX: number, clientY: number) => {
            onPhaseChange?.("start");

            // Dispatch global event for SingularityTransitionContainer to capture and animate
            const event = new CustomEvent("trigger-singularity-transition", {
                detail: {
                    x: clientX,
                    y: clientY,
                    destination,
                },
            });
            window.dispatchEvent(event);
        },
        [destination, onPhaseChange]
    );

    const bind = {
        onClick: (e: React.MouseEvent) => {
            e.preventDefault();
            runTransition(e.clientX, e.clientY);
        },
        onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                const rect = (e.target as HTMLElement).getBoundingClientRect();
                runTransition(rect.left + rect.width / 2, rect.top + rect.height / 2);
            }
        },
    };

    return {
        bind,
        canvasRefs: { scene: sceneCanvasRef, distort: distortCanvasRef },
        // Total forward duration, useful if a parent needs to coordinate
        // other UI (e.g. disabling other nav links during transition).
        approxDurationMs:
            (TIMING.click + TIMING.gravityAwaken + TIMING.distortionRamp + TIMING.eventHorizon + TIMING.blackHold) * 1000,
    };
}