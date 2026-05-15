import * as React from "react";

import { cn } from "@/lib/utils/cn";

export function Alert({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200",
        className,
      )}
      {...props}
    />
  );
}
