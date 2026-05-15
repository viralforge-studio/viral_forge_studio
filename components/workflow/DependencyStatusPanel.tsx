import { AlertTriangle, CheckCircle2, CircleDashed } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DependencyItem = {
  label: string;
  available: boolean;
};

export function DependencyStatusPanel({
  title,
  items,
  warning,
}: {
  title?: string;
  items: DependencyItem[];
  warning?: string | null;
}) {
  return (
    <Card className="border-white/10 bg-white/4">
      <CardHeader className="space-y-2">
        <CardTitle>{title ?? "Dependencies"}</CardTitle>
        <p className="text-sm leading-7 text-slate-300">
          Confirm the core inputs for this stage before generating or uploading JSON.
        </p>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-3"
            >
              <div className="flex items-center gap-2">
                {item.available ? (
                  <CheckCircle2 className="size-4 text-emerald-300" />
                ) : (
                  <CircleDashed className="size-4 text-slate-500" />
                )}
                <span className="text-sm text-slate-100">{item.label}</span>
              </div>
              <Badge variant={item.available ? "success" : "warning"}>
                {item.available ? "Available" : "Missing"}
              </Badge>
            </div>
          ))}
        </div>
        {warning ? (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-300" />
            <p className="text-sm leading-7 text-amber-100">{warning}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
