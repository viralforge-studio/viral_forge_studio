"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProjectListEditor } from "@/components/project/ProjectListEditor";
import {
  audienceOptions,
  languageOptions,
  manualOptionValue,
  positioningOptions,
  targetCountryOptions,
} from "@/lib/project/audiencePresets";
import {
  imageToolOptions,
  videoFormatOptions,
  videoToolOptions,
} from "@/lib/project/generationTools";
import { nicheOptions } from "@/lib/project/niches";
import {
  blankProjectValues,
  defaultProjectValues,
  type NewProjectInput,
} from "@/lib/schemas/project";
import { cn } from "@/lib/utils/cn";

type FormState = {
  [K in keyof NewProjectInput]: NewProjectInput[K];
};

const templateOptions = [
  {
    value: "future_files",
    label: "Future Files - Future Tech Mini Stories",
    description: "Use the current premium sci-fi defaults and creator workflow assumptions.",
  },
  {
    value: "blank_custom",
    label: "Blank Custom Project",
    description: "Start with a cleaner base and fill the creative system yourself.",
  },
] as const;

export function ProjectForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Array<{ path: string; message: string }>
  >([]);
  const [form, setForm] = useState<FormState>(defaultProjectValues);
  const [positioningMode, setPositioningMode] = useState(defaultProjectValues.positioning);
  const [audienceMode, setAudienceMode] = useState(defaultProjectValues.audience);
  const [targetCountriesMode, setTargetCountriesMode] = useState("us_uk_ca_au");
  const [languageMode, setLanguageMode] = useState(defaultProjectValues.language);

  const isFutureFiles = form.project_template === "future_files";

  const helperSummary = useMemo(
    () =>
      "These settings become the source of truth for every prompt in this project.",
    [],
  );

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function applyTemplate(template: NewProjectInput["project_template"]) {
    setForm(template === "future_files" ? defaultProjectValues : blankProjectValues);
    setPositioningMode(
      template === "future_files" ? defaultProjectValues.positioning : manualOptionValue,
    );
    setAudienceMode(
      template === "future_files" ? defaultProjectValues.audience : manualOptionValue,
    );
    setTargetCountriesMode(template === "future_files" ? "us_uk_ca_au" : manualOptionValue);
    setLanguageMode(template === "future_files" ? defaultProjectValues.language : manualOptionValue);
    setError(null);
    setValidationErrors([]);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setValidationErrors([]);

    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Unable to create project.");
      setValidationErrors(data.validationErrors ?? []);
      setIsSubmitting(false);
      return;
    }

    router.push(`/projects/${data.id}`);
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Create a project brief</CardTitle>
          <p className="text-sm leading-7 text-slate-300">{helperSummary}</p>
        </CardHeader>
        <CardContent className="grid gap-6">
          <Section
            title="Template"
            description="Choose whether to start from the Future Files production system or a blank custom setup."
          >
            <div className="grid gap-4 lg:grid-cols-2">
              {templateOptions.map((option) => {
                const active = form.project_template === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => applyTemplate(option.value)}
                    className={cn(
                      "grid gap-2 rounded-2xl border p-5 text-left transition",
                      active
                        ? "border-cyan-300/40 bg-cyan-400/10 shadow-[0_0_0_1px_rgba(103,232,249,0.16)]"
                        : "border-white/10 bg-white/4 hover:bg-white/6",
                    )}
                  >
                    <span className="text-sm font-medium text-white">{option.label}</span>
                    <span className="text-sm leading-7 text-slate-300">{option.description}</span>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="Basic Project" description="Core identity for the project.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Project Name">
                <Input
                  value={form.project_name}
                  onChange={(event) => updateField("project_name", event.target.value)}
                  placeholder="The Robot Who Watched the Door"
                />
              </Field>
              <Field label="Channel Name">
                <Input
                  value={form.channel_name}
                  onChange={(event) => updateField("channel_name", event.target.value)}
                  placeholder="Future Files"
                />
              </Field>
              <Field label="Niche">
                <select
                  value={form.niche}
                  onChange={(event) => updateField("niche", event.target.value)}
                  className={selectClassName(form.niche)}
                >
                  <option value="">Select a niche</option>
                  {nicheOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs leading-6 text-slate-500">
                  {nicheOptions.find((option) => option.value === form.niche)?.description ??
                    "Choose the content lane that should guide ideas, prompts, visuals, and video generation."}
                </p>
              </Field>
              <Field label="Platform">
                <Input
                  value={form.platform}
                  onChange={(event) => updateField("platform", event.target.value)}
                  placeholder="TikTok / YouTube Shorts / Instagram Reels"
                />
              </Field>
            </div>
          </Section>

          <Section
            title="Production Settings"
            description="Time, cost, and tool constraints that shape later prompts."
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Field label="Target Duration Seconds">
                <Input
                  type="number"
                  value={form.target_duration_seconds}
                  onChange={(event) =>
                    updateField("target_duration_seconds", Number(event.target.value))
                  }
                />
              </Field>
              <Field label="Scene Count">
                <Input
                  type="number"
                  value={form.scene_count}
                  onChange={(event) => updateField("scene_count", Number(event.target.value))}
                />
              </Field>
              <Field label="Budget Range">
                <Input
                  value={form.budget_range}
                  onChange={(event) => updateField("budget_range", event.target.value)}
                  placeholder="$30-50 per video"
                />
              </Field>
              <Field label="Primary AI Video Tool">
                <select
                  value={form.primary_ai_video_tool}
                  onChange={(event) => updateField("primary_ai_video_tool", event.target.value)}
                  className={selectClassName(form.primary_ai_video_tool)}
                >
                  <option value="">Select video tool</option>
                  {videoToolOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs leading-6 text-slate-500">
                  {videoToolOptions.find(
                    (option) => option.value === form.primary_ai_video_tool,
                  )?.description ??
                    "Choose the video tool that final Kling/video prompts should be optimized around."}
                </p>
              </Field>
              <Field label="Image Generation Tool">
                <select
                  value={form.image_generation_tool}
                  onChange={(event) => updateField("image_generation_tool", event.target.value)}
                  className={selectClassName(form.image_generation_tool)}
                >
                  <option value="">Select image tool</option>
                  {imageToolOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs leading-6 text-slate-500">
                  {imageToolOptions.find(
                    (option) => option.value === form.image_generation_tool,
                  )?.description ??
                    "Choose Manual / user-selected when image generation will happen outside a fixed provider."}
                </p>
              </Field>
              <Field label="Video Format">
                <select
                  value={form.video_format}
                  onChange={(event) => updateField("video_format", event.target.value)}
                  className={selectClassName(form.video_format)}
                >
                  <option value="">Select video format</option>
                  {videoFormatOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs leading-6 text-slate-500">
                  {videoFormatOptions.find((option) => option.value === form.video_format)
                    ?.description ??
                    "Choose the delivery format that should guide framing, aspect ratio, and composition."}
                </p>
              </Field>
            </div>
          </Section>

          <Section
            title="Audience & Positioning"
            description="How this project should feel to the viewer and where it should resonate."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Positioning">
                <select
                  value={positioningMode}
                  onChange={(event) => {
                    const value = event.target.value;
                    setPositioningMode(value);
                    if (value !== manualOptionValue) {
                      updateField("positioning", value);
                    }
                  }}
                  className={selectClassName(positioningMode)}
                >
                  {positioningOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs leading-6 text-slate-500">
                  {positioningOptions.find((option) => option.value === positioningMode)
                    ?.description ?? "Choose how this project should be positioned."}
                </p>
                {positioningMode === manualOptionValue ? (
                  <Textarea
                    value={form.positioning}
                    onChange={(event) => updateField("positioning", event.target.value)}
                    className="min-h-[120px]"
                    placeholder="Write custom positioning for this project"
                  />
                ) : null}
              </Field>
              <Field label="Audience">
                <select
                  value={audienceMode}
                  onChange={(event) => {
                    const value = event.target.value;
                    setAudienceMode(value);
                    if (value !== manualOptionValue) {
                      updateField("audience", value);
                    }
                  }}
                  className={selectClassName(audienceMode)}
                >
                  {audienceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs leading-6 text-slate-500">
                  {audienceOptions.find((option) => option.value === audienceMode)
                    ?.description ?? "Choose the viewer profile this project should target."}
                </p>
                {audienceMode === manualOptionValue ? (
                  <Textarea
                    value={form.audience}
                    onChange={(event) => updateField("audience", event.target.value)}
                    className="min-h-[120px]"
                    placeholder="Write a custom audience profile"
                  />
                ) : null}
              </Field>
              <Field label="Target Countries">
                <select
                  value={targetCountriesMode}
                  onChange={(event) => {
                    const value = event.target.value;
                    const option = targetCountryOptions.find((item) => item.value === value);
                    setTargetCountriesMode(value);
                    if (option && value !== manualOptionValue) {
                      updateField("target_countries", [...option.countries]);
                    }
                  }}
                  className={selectClassName(targetCountriesMode)}
                >
                  {targetCountryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs leading-6 text-slate-500">
                  {targetCountryOptions.find((option) => option.value === targetCountriesMode)
                    ?.description ?? "Choose the target markets for this project."}
                </p>
                {targetCountriesMode === manualOptionValue ? (
                  <ProjectListEditor
                    label="Custom Countries"
                    helper="Add one country per line."
                    items={form.target_countries}
                    onChange={(items) => updateField("target_countries", items)}
                    placeholder="United States"
                  />
                ) : (
                  <p className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm leading-7 text-slate-300">
                    {form.target_countries.join(", ")}
                  </p>
                )}
              </Field>
              <Field label="Language">
                <select
                  value={languageMode}
                  onChange={(event) => {
                    const value = event.target.value;
                    setLanguageMode(value);
                    if (value !== manualOptionValue) {
                      updateField("language", value);
                    }
                  }}
                  className={selectClassName(languageMode)}
                >
                  {languageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs leading-6 text-slate-500">
                  {languageOptions.find((option) => option.value === languageMode)
                    ?.description ?? "Choose the primary language for generated prompts."}
                </p>
                {languageMode === manualOptionValue ? (
                  <Input
                    value={form.language}
                    onChange={(event) => updateField("language", event.target.value)}
                    placeholder="English + Spanish bilingual"
                  />
                ) : null}
              </Field>
            </div>
          </Section>

          <Section
            title="Creative Style"
            description="Creative direction that should carry through scripting, design, prompts, and review."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Tone">
                <Textarea
                  value={form.tone}
                  onChange={(event) => updateField("tone", event.target.value)}
                />
              </Field>
              <Field label="Visual Style">
                <Textarea
                  value={form.visual_style}
                  onChange={(event) => updateField("visual_style", event.target.value)}
                />
              </Field>
              <Field label="Reference Style Notes">
                <Textarea
                  value={form.reference_style_notes}
                  onChange={(event) =>
                    updateField("reference_style_notes", event.target.value)
                  }
                />
              </Field>
              <Field label="CTA Style">
                <Textarea
                  value={form.cta_style}
                  onChange={(event) => updateField("cta_style", event.target.value)}
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Face Policy">
                  <Textarea
                    value={form.face_policy}
                    onChange={(event) => updateField("face_policy", event.target.value)}
                  />
                </Field>
              </div>
            </div>
          </Section>

          <Section
            title="Safety Rules"
            description="Guardrails for idea quality, visual consistency, and production safety."
          >
            <div className="grid gap-4 xl:grid-cols-3">
              <ProjectListEditor
                label="Content Pillars"
                helper="High-level story lanes the AI should stay within."
                items={form.content_pillars}
                onChange={(items) => updateField("content_pillars", items)}
                placeholder="Robots & AI Society"
              />
              <ProjectListEditor
                label="Blocked Topics"
                helper="Topics or subjects the AI should avoid."
                items={form.blocked_topics}
                onChange={(items) => updateField("blocked_topics", items)}
                placeholder="Politics"
              />
              <ProjectListEditor
                label="Negative Visual Rules"
                helper="Visual patterns to avoid in generated media and prompts."
                items={form.negative_visual_rules}
                onChange={(items) => updateField("negative_visual_rules", items)}
                placeholder="No neon cyberpunk"
              />
            </div>
          </Section>
        </CardContent>
      </Card>

      {isFutureFiles ? (
        <Alert className="border-cyan-400/20 bg-cyan-400/10 text-cyan-100">
          Future Files defaults are loaded. You can still customize every field before creating the
          project.
        </Alert>
      ) : null}

      {error ? (
        <Alert className="border-rose-400/25 bg-rose-400/10 text-rose-100">
          <div className="grid gap-2">
            <p>{error}</p>
            {validationErrors.map((issue) => (
              <p key={`${issue.path}-${issue.message}`}>
                <span className="font-medium">{issue.path}:</span> {issue.message}
              </p>
            ))}
          </div>
        </Alert>
      ) : null}

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/85 p-4 shadow-[0_18px_40px_rgba(2,6,23,0.36)] backdrop-blur">
        <div>
          <p className="text-sm font-medium text-white">
            {form.project_name || "Untitled project"}
          </p>
          <p className="text-sm text-slate-400">
            {form.channel_name || "Channel pending"} · {form.platform}
          </p>
        </div>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Project"}
        </Button>
      </div>
    </form>
  );
}

function selectClassName(value: string) {
  return cn(
    "flex h-12 w-full rounded-[18px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.11),rgba(255,255,255,0.045))] px-4 py-2 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_14px_34px_rgba(2,6,23,0.22)] outline-none backdrop-blur transition focus-visible:border-cyan-200/60 focus-visible:bg-white/10 focus-visible:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_0_0_4px_rgba(103,232,249,0.10),0_16px_38px_rgba(2,6,23,0.28)]",
    value ? "" : "text-slate-500",
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-4 rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="max-w-3xl text-sm leading-7 text-slate-400">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
