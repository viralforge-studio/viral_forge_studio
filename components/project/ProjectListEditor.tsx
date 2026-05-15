"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ProjectListEditor({
  label,
  helper,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  helper?: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");

  function addItem() {
    const next = draft.trim();
    if (!next || items.includes(next)) {
      setDraft("");
      return;
    }

    onChange([...items, next]);
    setDraft("");
  }

  function removeItem(item: string) {
    onChange(items.filter((current) => current !== item));
  }

  function handleTextareaChange(value: string) {
    const nextItems = value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
    onChange(nextItems);
  }

  return (
    <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/4 p-4">
      <div className="space-y-1">
        <p className="text-sm font-medium text-white">{label}</p>
        {helper ? <p className="text-sm text-slate-400">{helper}</p> : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {items.length > 0 ? (
          items.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => removeItem(item)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-sm text-slate-100 transition hover:bg-white/10"
            >
              <span>{item}</span>
              <X className="size-3.5 text-slate-400" />
            </button>
          ))
        ) : (
          <Badge className="text-slate-400">No items added yet</Badge>
        )}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={placeholder}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addItem();
            }
          }}
        />
        <Button type="button" variant="secondary" onClick={addItem}>
          <Plus className="size-4" />
          Add
        </Button>
      </div>
      <Textarea
        value={items.join("\n")}
        onChange={(event) => handleTextareaChange(event.target.value)}
        className="min-h-[140px] text-sm leading-7"
        placeholder="One item per line"
      />
    </div>
  );
}
