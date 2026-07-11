export default function GlassCard({
  as: Component = "div",
  className = "",
  interactive = false,
  children,
  ...props
}) {
  return (
    <Component
      className={[
        "relative overflow-hidden rounded-xl border border-white/6 bg-[rgba(14,14,20,0.92)] backdrop-blur-xl",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
        "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[rgba(0,245,255,0.25)] before:to-transparent before:opacity-50",
        "after:absolute after:left-0 after:top-0 after:w-[3px] after:h-full after:bg-gradient-to-b after:from-[rgba(0,245,255,0.2)] after:to-transparent after:opacity-30",
        interactive
          ? "transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(0,245,255,0.15)] hover:shadow-[0_0_16px_rgba(0,245,255,0.05),inset_0_1px_0_rgba(255,255,255,0.06)]"
          : "",
        className,
      ].join(" ")}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </Component>
  );
}