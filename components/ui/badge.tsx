import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium tracking-wide",
  {
    variants: {
      variant: {
        default: "border-white/10 bg-white/6 text-slate-100",
        accent: "border-cyan-400/30 bg-cyan-400/12 text-cyan-100",
        success: "border-emerald-400/30 bg-emerald-400/12 text-emerald-100",
        warning: "border-amber-400/30 bg-amber-400/12 text-amber-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
