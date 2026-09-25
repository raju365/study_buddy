export function Blob({ className, color }) {
  return <div className={`absolute rounded-full blur-sm ${className}`} style={{ background: color }} />;
}

export function StickyNote({ className, children }) {
  return (
    <p className={`absolute font-serif italic text-[#8B84C4] text-sm leading-tight rotate-[-3deg] ${className}`}>
      {children}
    </p>
  );
}