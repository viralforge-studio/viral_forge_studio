"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  variant = "secondary",
  size = "default",
  className,
}: {
  value: string;
  label?: string;
  copiedLabel?: string;
  variant?: "default" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "default" | "lg" | "icon";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <Button variant={variant} size={size} onClick={handleCopy} className={className}>
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {copied ? copiedLabel : label}
    </Button>
  );
}
