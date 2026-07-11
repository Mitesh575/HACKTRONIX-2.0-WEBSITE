export default function AccentCard({
  as: Component = "div",
  className = "",
  gradient = "from-primary to-secondary",
  children,
  ...props
}) {
  return (
    <Component
      className={["group relative rounded-xl", className].join(" ")}
      {...props}
    >
      <div className="relative overflow-hidden rounded-xl border border-white/8 bg-[rgba(14,14,20,0.92)] transition-colors duration-300 group-hover:border-[rgba(0,245,255,0.15)]">
        {/* Top holo line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(0,245,255,0.3)] to-transparent opacity-50" />
        {/* Left accent strip */}
        <div className={`absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b ${gradient} opacity-30`} />
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[rgba(0,245,255,0.2)] rounded-tl-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[rgba(0,245,255,0.2)] rounded-tr-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[rgba(0,245,255,0.2)] rounded-bl-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[rgba(0,245,255,0.2)] rounded-br-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative z-10">{children}</div>
      </div>
    </Component>
  );
}