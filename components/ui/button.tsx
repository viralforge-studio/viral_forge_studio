"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] text-slate-950 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_40px_rgba(250,204,21,0.12)] hover:brightness-110",
        secondary:
          "border border-white/12 bg-white/6 text-white hover:bg-white/10",
        ghost: "text-slate-200 hover:bg-white/8",
        destructive: "bg-rose-500/90 text-white hover:bg-rose-500",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-5 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { Button, buttonVariants };
