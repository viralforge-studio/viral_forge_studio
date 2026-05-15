import { cn } from "@/lib/utils/cn";

export function StickyActionBar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "sticky top-4 z-10 flex flex-wrap gap-3 rounded-2xl border border-white/10 bg-slate-950/85 p-3 shadow-[0_18px_40px_rgba(2,6,23,0.36)] backdrop-blur",
        className,
      )}
    >
      {children}
    </div>
  );
}
