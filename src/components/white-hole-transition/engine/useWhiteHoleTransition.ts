import { useCallback } from "react";

export function useWhiteHoleTransition() {
  const triggerTransition = useCallback((destination: string, e: React.MouseEvent) => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const event = new CustomEvent("trigger-whitehole-transition", {
      detail: { x, y, destination },
    });
    window.dispatchEvent(event);
  }, []);

  const bind = (destination: string) => ({
    onClick: (e: React.MouseEvent) => triggerTransition(destination, e),
  });

  return { triggerTransition, bind };
}
