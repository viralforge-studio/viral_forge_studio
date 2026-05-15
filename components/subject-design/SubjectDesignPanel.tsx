"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { CopyButton } from "@/components/common/CopyButton";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { type Project } from "@/lib/schemas/project";
import {
  type Environment,
  type GlobalStyleGuide,
  type ImageGenerationReadiness,
  type MainSubject,
  type Prop,
  type SceneDesignMap,
  type SubjectDesign,
} from "@/lib/schemas/subject-design";
import { formatDateTime } from "@/lib/utils/dates";

const sections = [
  { key: "overview", label: "Overview" },
  { key: "subjects", label: "Main Subjects" },
  { key: "environments", label: "Environments" },
  { key: "props", label: "Props" },
  { key: "scene-map", label: "Scene Map" },
  { key: "style-guide", label: "Style Guide" },
  { key: "image-readiness", label: "Image Readiness" },
  { key: "review", label: "Review" },
] as const;

type SectionKey = (typeof sections)[number]["key"];

function getSourceLabel(source: Project["subject_design_source"]) {
  if (source === "generated") return "Generated";
  if (source === "uploaded") return "Uploaded";
  if (source === "pasted") return "Pasted";
  return null;
}

export function SubjectDesignPanel({ project }: { project: Project }) {
  const [activeSection, setActiveSection] = useState<SectionKey>("overview");
  const [showRawJson, setShowRawJson] = useState(false);
  const [reviewNotes, setReviewNotes] = useState(project.subject_design_review_notes ?? "");
  const [savedReviewNotes, setSavedReviewNotes] = useState(project.subject_design_review_notes ?? "");
  const [reviewedAt, setReviewedAt] = useState(project.subject_design_reviewed_at);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSavingReview, setIsSavingReview] = useState(false);
  const [isMarkingReviewed, setIsMarkingReviewed] = useState(false);
  const design = project.subject_design;

  if (!design) {
    return (
      <Card>
        <CardContent className="p-8 text-slate-300">
          No subject design generated yet. Go to Subject Design Prompt and generate, upload, or
          paste subject design JSON.
        </CardContent>
      </Card>
    );
  }

  const recommendedFirstImage =
    findPromptTargetName(design, design.image_generation_readiness.recommended_first_design_image) ??
    design.image_generation_readiness.recommended_first_design_image;

  const assetSummary = [
    { label: "Main Subjects", value: design.main_subjects.length },
    { label: "Environments", value: design.environments.length },
    { label: "Props", value: design.props.length },
    { label: "Scene Mappings", value: design.scene_design_map.length },
  ];

  async function saveReview(markReviewed: boolean) {
    if (markReviewed) {
      setIsMarkingReviewed(true);
    } else {
      setIsSavingReview(true);
    }

    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${project.id}/subject-design-review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject_design_review_notes: reviewNotes.trim().length > 0 ? reviewNotes : null,
          mark_reviewed: markReviewed,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to save subject design review.");
        return;
      }

      setReviewNotes(data.subject_design_review_notes ?? "");
      setSavedReviewNotes(data.subject_design_review_notes ?? "");
      setReviewedAt(data.subject_design_reviewed_at ?? null);
      setMessage(
        markReviewed
          ? "Subject design marked reviewed."
          : "Subject design review notes saved.",
      );
    } catch (reviewError) {
      setError(
        reviewError instanceof Error
          ? reviewError.message
          : "Unable to save subject design review.",
      );
    } finally {
      setIsSavingReview(false);
      setIsMarkingReviewed(false);
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-[1480px] gap-6">
      <Card className="overflow-hidden border-white/12 bg-[linear-gradient(135deg,rgba(8,15,30,0.96),rgba(14,165,233,0.07))]">
        <CardHeader className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="accent">Subject Design</Badge>
                {project.subject_design_source ? <Badge>{getSourceLabel(project.subject_design_source)}</Badge> : null}
                {reviewedAt ? (
                  <Badge variant="success">Reviewed {formatDateTime(reviewedAt)}</Badge>
                ) : null}
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl text-white">Subject Design</CardTitle>
                <p className="text-lg font-medium text-slate-100">{design.source_idea_title}</p>
                <p className="max-w-4xl text-sm leading-7 text-slate-300">
                  {design.visual_style_summary}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-3">
              <CopyButton
                value={JSON.stringify(design, null, 2)}
                label="Copy Full Subject Design JSON"
                copiedLabel="JSON Copied"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowRawJson((current) => !current)}
              >
                {showRawJson ? "Hide Raw JSON" : "Show Raw JSON"}
              </Button>
              <Link href={`/projects/${project.id}?tab=design-image-prompts`}>
                <Button variant="default">Continue to Reference Image Prompts</Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/4 p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Project Context</p>
              <div className="flex flex-wrap gap-2">
                <Badge>{design.source_script_title}</Badge>
                <Badge>{design.main_subjects.length} subjects</Badge>
                <Badge>{design.environments.length} environments</Badge>
                <Badge>{design.props.length} props</Badge>
                <Badge>First image: {recommendedFirstImage}</Badge>
              </div>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-300">
              This stage creates visual design specs only. It does not generate images, image
              prompts, Kling prompts, or video.
            </p>
          </div>
        </CardHeader>
      </Card>

      {message ? (
        <Alert className="border-emerald-400/20 bg-emerald-400/10 text-emerald-100">
          {message}
        </Alert>
      ) : null}
      {error ? (
        <Alert className="border-rose-400/20 bg-rose-400/10 text-rose-100">{error}</Alert>
      ) : null}

      <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-3">
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <button
              key={section.key}
              type="button"
              onClick={() => setActiveSection(section.key)}
              className={[
                "rounded-xl px-3 py-2 text-sm transition-colors",
                activeSection === section.key
                  ? "bg-cyan-400/12 text-cyan-100"
                  : "bg-white/4 text-slate-300 hover:bg-white/8 hover:text-white",
              ].join(" ")}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {activeSection === "overview" ? (
        <OverviewSection design={design} assetSummary={assetSummary} />
      ) : null}
      {activeSection === "subjects" ? <SubjectsSection design={design} /> : null}
      {activeSection === "environments" ? <EnvironmentsSection design={design} /> : null}
      {activeSection === "props" ? <PropsSection design={design} /> : null}
      {activeSection === "scene-map" ? <SceneMapSection design={design} /> : null}
      {activeSection === "style-guide" ? <StyleGuideSection guide={design.global_style_guide} /> : null}
      {activeSection === "image-readiness" ? (
        <ImageReadinessSection
          projectId={project.id}
          readiness={design.image_generation_readiness}
          design={design}
        />
      ) : null}
      {activeSection === "review" ? (
        <ReviewSection
          design={design}
          reviewedAt={reviewedAt}
          reviewNotes={reviewNotes}
          savedReviewNotes={savedReviewNotes}
          onReviewNotesChange={setReviewNotes}
          onSaveReview={() => void saveReview(false)}
          onMarkReviewed={() => void saveReview(true)}
          isSavingReview={isSavingReview}
          isMarkingReviewed={isMarkingReviewed}
        />
      ) : null}

      {showRawJson ? (
        <Card>
          <CardHeader>
            <CardTitle>Raw Subject Design JSON</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="max-h-[36rem] overflow-auto rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-xs leading-6 text-cyan-100">
              <code>{JSON.stringify(design, null, 2)}</code>
            </pre>
          </CardContent>
        </Card>
      ) : null}

      <div className="flex justify-end">
        <Link href={`/projects/${project.id}?tab=design-image-prompts`}>
          <Button variant="secondary">Continue to Reference Image Prompts</Button>
        </Link>
      </div>
    </div>
  );
}

function OverviewSection({
  design,
  assetSummary,
}: {
  design: SubjectDesign;
  assetSummary: Array<{ label: string; value: number }>;
}) {
  const recommendedFirstImage =
    findPromptTargetName(design, design.image_generation_readiness.recommended_first_design_image) ??
    design.image_generation_readiness.recommended_first_design_image;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <ValueCard
        title="Visual Style Summary"
        value={design.visual_style_summary}
        copyLabel="Copy Visual Style Summary"
        copiedLabel="Summary Copied"
      />
      <Card>
        <CardHeader>
          <CardTitle>Quick Assets Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {assetSummary.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/4 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/8 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/70">
              Recommended First Design Image
            </p>
            <p className="mt-2 text-sm font-medium text-white">{recommendedFirstImage}</p>
          </div>
        </CardContent>
      </Card>
      <ValueCard
        title="Design Goal"
        value={design.design_goal}
        copyLabel="Copy Design Goal"
        copiedLabel="Goal Copied"
      />
    </div>
  );
}

function SubjectsSection({ design }: { design: SubjectDesign }) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {design.main_subjects.map((subject) => (
        <SubjectDashboardCard key={subject.id} subject={subject} />
      ))}
    </div>
  );
}

function EnvironmentsSection({ design }: { design: SubjectDesign }) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {design.environments.map((environment) => (
        <EnvironmentDashboardCard key={environment.id} environment={environment} />
      ))}
    </div>
  );
}

function PropsSection({ design }: { design: SubjectDesign }) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {design.props.map((prop) => (
        <PropDashboardCard key={prop.id} prop={prop} />
      ))}
    </div>
  );
}

function SceneMapSection({ design }: { design: SubjectDesign }) {
  const fullSceneMap = JSON.stringify(design.scene_design_map, null, 2);

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <CardTitle>Scene Design Map</CardTitle>
            <p className="max-w-3xl text-sm leading-7 text-slate-300">
              Use these scene cards to quickly confirm which subjects, environments, props, and
              continuity notes each scene depends on.
            </p>
          </div>
          <CopyButton
            value={fullSceneMap}
            label="Copy Scene Design Map"
            copiedLabel="Scene Map Copied"
          />
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2">
        {design.scene_design_map.map((scene) => (
          <SceneMapCard key={scene.scene_number} scene={scene} />
        ))}
      </CardContent>
    </Card>
  );
}

function StyleGuideSection({ guide }: { guide: GlobalStyleGuide }) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <ValueCard
        title="Camera Language"
        value={guide.camera_language}
        copyLabel="Copy Camera Language"
        copiedLabel="Camera Language Copied"
      />
      <ValueCard
        title="Lighting Language"
        value={guide.lighting_language}
        copyLabel="Copy Lighting Language"
        copiedLabel="Lighting Language Copied"
      />
      <ValueCard
        title="Texture Language"
        value={guide.texture_language}
        copyLabel="Copy Texture Language"
        copiedLabel="Texture Language Copied"
      />
      <Card>
        <CardHeader>
          <CardTitle>Mood Keywords</CardTitle>
        </CardHeader>
        <CardContent>
          <BadgeList items={guide.mood_keywords} />
        </CardContent>
      </Card>
      <Card className="xl:col-span-2">
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
          <CardTitle>Negative Style Rules</CardTitle>
          <CopyButton
            value={guide.negative_style_rules.join("\n")}
            label="Copy Negative Style Rules"
            copiedLabel="Rules Copied"
          />
        </CardHeader>
        <CardContent>
          <WarningList items={guide.negative_style_rules} />
        </CardContent>
      </Card>
    </div>
  );
}

function ImageReadinessSection({
  projectId,
  readiness,
  design,
}: {
  projectId: string;
  readiness: ImageGenerationReadiness;
  design: SubjectDesign;
}) {
  const recommendedFirstImage =
    findPromptTargetName(design, readiness.recommended_first_design_image) ??
    readiness.recommended_first_design_image;

  return (
    <Card className="border-cyan-400/20 bg-[linear-gradient(135deg,rgba(8,15,30,0.95),rgba(14,165,233,0.09))]">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <Badge variant="accent">Next Action</Badge>
            <CardTitle>Image Generation Readiness</CardTitle>
            <p className="max-w-3xl text-sm leading-7 text-slate-300">
              This is the handoff into Reference Image Prompts. Use the recommended first design image
              and prompt seed to create reusable still-reference prompts next.
            </p>
          </div>
          <Link href={`/projects/${projectId}?tab=design-image-prompts`}>
            <Button>Continue to Reference Image Prompts</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Card className="border-white/10 bg-white/4">
          <CardHeader>
            <CardTitle>Recommended First Design Image</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <p className="text-lg font-medium text-white">{recommendedFirstImage}</p>
            <p className="text-sm leading-7 text-slate-300">{readiness.why}</p>
            <div className="flex flex-wrap gap-3">
              <CopyButton
                value={readiness.recommended_first_design_image}
                label="Copy Recommended First Design Image ID"
                copiedLabel="ID Copied"
              />
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/4">
          <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
            <CardTitle>Reference Image Prompt Seed</CardTitle>
            <CopyButton
              value={readiness.reference_image_prompt_seed}
              label="Copy Reference Image Prompt Seed"
              copiedLabel="Seed Copied"
            />
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-200">
              {readiness.reference_image_prompt_seed}
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

function ReviewSection({
  design,
  reviewedAt,
  reviewNotes,
  savedReviewNotes,
  onReviewNotesChange,
  onSaveReview,
  onMarkReviewed,
  isSavingReview,
  isMarkingReviewed,
}: {
  design: SubjectDesign;
  reviewedAt: string | null;
  reviewNotes: string;
  savedReviewNotes: string;
  onReviewNotesChange: (value: string) => void;
  onSaveReview: () => void;
  onMarkReviewed: () => void;
  isSavingReview: boolean;
  isMarkingReviewed: boolean;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CardTitle>Human Review</CardTitle>
            <Badge variant={design.human_review.needs_review ? "warning" : "accent"}>
              {design.human_review.needs_review ? "Needs Review" : "Review Optional"}
            </Badge>
          </div>
          <p className="text-sm leading-7 text-slate-300">
            Review the subject system, environment continuity, and style rules before creating
            reference image prompts.
          </p>
        </CardHeader>
        <CardContent className="grid gap-6">
          <ChecklistList items={design.human_review.review_questions} />
          <div className="grid gap-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Subject Design Review Notes
            </p>
            <Textarea
              value={reviewNotes}
              onChange={(event) => onReviewNotesChange(event.target.value)}
              placeholder="Capture approval notes, consistency concerns, or changes to make before the next stage."
              className="min-h-[180px] rounded-2xl border-white/10 bg-white/4 text-sm leading-7 text-slate-100 placeholder:text-slate-500"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onSaveReview}
              disabled={isSavingReview || isMarkingReviewed}
            >
              {isSavingReview ? "Saving Review Notes..." : "Save Review Notes"}
            </Button>
            <Button
              type="button"
              onClick={onMarkReviewed}
              disabled={isSavingReview || isMarkingReviewed}
            >
              {isMarkingReviewed ? "Marking Reviewed..." : "Mark Subject Design Reviewed"}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Review Status</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm">
          <StatusRow
            label="Saved Notes"
            value={
              savedReviewNotes.trim().length > 0
                ? "Review notes have been saved for this subject design."
                : "No review notes saved yet."
            }
          />
          <StatusRow
            label="Reviewed At"
            value={
              reviewedAt
                ? formatDateTime(reviewedAt)
                : "Not marked reviewed yet."
            }
          />
          <Alert className="border-cyan-400/15 bg-cyan-400/8 text-slate-100">
            Keep this review lightweight and practical. The goal is to catch continuity drift,
            generic design choices, and risky visual details before prompt production expands.
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}

function SubjectDashboardCard({ subject }: { subject: MainSubject }) {
  const fullSubjectJson = JSON.stringify(subject, null, 2);

  return (
    <Card className="border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.02))]">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="accent">{subject.type}</Badge>
              <Badge>{subject.role_in_story}</Badge>
              {subject.age_or_condition ? <Badge>{subject.age_or_condition}</Badge> : null}
            </div>
            <CardTitle>{subject.name}</CardTitle>
          </div>
          <CopyButton value={fullSubjectJson} label="Copy Full Subject" copiedLabel="Subject Copied" />
        </div>
      </CardHeader>
      <CardContent className="grid gap-5">
        <ValueBlock
          label="Description"
          value={subject.description}
          action={
            <CopyButton
              value={subject.description}
              label="Copy Description"
              copiedLabel="Description Copied"
            />
          }
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <ValueCardMini label="Silhouette" value={subject.silhouette} />
          <ValueCardMini label="Lighting Interaction" value={subject.lighting_interaction} />
          <ValueCardMini label="Emotion to Convey" value={subject.emotion_to_convey} />
          <ValueCardMini label="Face Policy" value={subject.face_policy} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TokenSection label="Materials" items={subject.materials} />
          <TokenSection label="Colors" items={subject.colors} />
        </div>
        <RuleCard
          title="Consistency Rules"
          items={subject.consistency_rules}
          tone="check"
          copyValue={subject.consistency_rules.join("\n")}
          copyLabel="Copy Consistency Rules"
          copiedLabel="Rules Copied"
        />
        <RuleCard
          title="Avoid Rules"
          items={subject.avoid}
          tone="warning"
          copyValue={subject.avoid.join("\n")}
          copyLabel="Copy Avoid Rules"
          copiedLabel="Avoid Rules Copied"
        />
      </CardContent>
    </Card>
  );
}

function EnvironmentDashboardCard({ environment }: { environment: Environment }) {
  const fullEnvironmentJson = JSON.stringify(environment, null, 2);

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="accent">Environment</Badge>
              <Badge>{environment.role_in_story}</Badge>
            </div>
            <CardTitle>{environment.name}</CardTitle>
          </div>
          <CopyButton
            value={fullEnvironmentJson}
            label="Copy Full Environment"
            copiedLabel="Environment Copied"
          />
        </div>
      </CardHeader>
      <CardContent className="grid gap-5">
        <ValueBlock
          label="Description"
          value={environment.description}
          action={
            <CopyButton
              value={environment.description}
              label="Copy Description"
              copiedLabel="Description Copied"
            />
          }
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <ValueCardMini label="Architecture Style" value={environment.architecture_style} />
          <ValueBlock
            label="Lighting"
            value={environment.lighting}
            action={
              <CopyButton
                value={environment.lighting}
                label="Copy Lighting"
                copiedLabel="Lighting Copied"
              />
            }
          />
          <ValueCardMini label="Mood" value={environment.mood} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TokenSection label="Materials" items={environment.materials} />
          <TokenSection label="Color Palette" items={environment.color_palette} />
        </div>
        <RuleCard
          title="Continuity Rules"
          items={environment.continuity_rules}
          tone="check"
          copyValue={environment.continuity_rules.join("\n")}
          copyLabel="Copy Continuity Rules"
          copiedLabel="Continuity Copied"
        />
        <RuleCard
          title="Avoid Rules"
          items={environment.avoid}
          tone="warning"
          copyValue={environment.avoid.join("\n")}
          copyLabel="Copy Avoid Rules"
          copiedLabel="Avoid Copied"
        />
      </CardContent>
    </Card>
  );
}

function PropDashboardCard({ prop }: { prop: Prop }) {
  const fullPropJson = JSON.stringify(prop, null, 2);

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="accent">Prop</Badge>
              <Badge>{prop.role_in_story}</Badge>
            </div>
            <CardTitle>{prop.name}</CardTitle>
          </div>
          <CopyButton value={fullPropJson} label="Copy Prop" copiedLabel="Prop Copied" />
        </div>
      </CardHeader>
      <CardContent className="grid gap-5">
        <ValueBlock
          label="Description"
          value={prop.description}
          action={
            <CopyButton
              value={prop.description}
              label="Copy Description"
              copiedLabel="Description Copied"
            />
          }
        />
        <RuleCard
          title="Visual Rules"
          items={prop.visual_rules}
          tone="check"
          copyValue={prop.visual_rules.join("\n")}
          copyLabel="Copy Visual Rules"
          copiedLabel="Visual Rules Copied"
        />
        <RuleCard title="Avoid Rules" items={prop.avoid} tone="warning" />
      </CardContent>
    </Card>
  );
}

function SceneMapCard({ scene }: { scene: SceneDesignMap }) {
  const sceneText = [
    `Scene ${scene.scene_number} - ${scene.scene_role}`,
    `Design Focus: ${scene.design_focus}`,
    `Required Subjects: ${scene.required_subjects.join(", ")}`,
    `Required Environments: ${scene.required_environments.join(", ")}`,
    `Required Props: ${scene.required_props.join(", ") || "None"}`,
    `Continuity Notes: ${scene.continuity_notes}`,
  ].join("\n");

  return (
    <Card className="border-white/10 bg-white/4">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="accent">Scene {scene.scene_number}</Badge>
              <Badge>{scene.scene_role}</Badge>
            </div>
            <CardTitle className="text-base">{scene.design_focus}</CardTitle>
          </div>
          <CopyButton
            value={sceneText}
            label={`Copy Scene ${scene.scene_number} Notes`}
            copiedLabel="Scene Notes Copied"
          />
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <ValueCardMini label="Design Focus" value={scene.design_focus} />
        <TokenSection label="Required Subjects" items={scene.required_subjects} />
        <TokenSection label="Required Environments" items={scene.required_environments} />
        <TokenSection label="Required Props" items={scene.required_props} emptyLabel="No required props" />
        <ValueCardMini label="Continuity Notes" value={scene.continuity_notes} />
      </CardContent>
    </Card>
  );
}

function ValueCard({
  title,
  value,
  copyLabel,
  copiedLabel,
}: {
  title: string;
  value: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
        <CardTitle>{title}</CardTitle>
        <CopyButton value={value} label={copyLabel} copiedLabel={copiedLabel} />
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-7 text-slate-200">{value}</p>
      </CardContent>
    </Card>
  );
}

function ValueBlock({
  label,
  value,
  action,
}: {
  label: string;
  value: string;
  action?: ReactNode;
}) {
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
        {action}
      </div>
      <p className="whitespace-pre-wrap text-sm leading-7 text-slate-200">{value}</p>
    </div>
  );
}

function ValueCardMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm leading-7 text-slate-200">{value}</p>
    </div>
  );
}

function TokenSection({
  label,
  items,
  emptyLabel = "None listed",
}: {
  label: string;
  items: string[];
  emptyLabel?: string;
}) {
  return (
    <div className="grid gap-2">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      {items.length > 0 ? <BadgeList items={items} /> : <p className="text-sm text-slate-400">{emptyLabel}</p>}
    </div>
  );
}

function BadgeList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Badge key={item}>{item}</Badge>
      ))}
    </div>
  );
}

function ChecklistList({ items }: { items: string[] }) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div
          key={item}
          className="flex items-start gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-400/8 p-3"
        >
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-300" />
          <p className="text-sm leading-7 text-slate-100">{item}</p>
        </div>
      ))}
    </div>
  );
}

function WarningList({ items }: { items: string[] }) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div
          key={item}
          className="flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/8 p-3"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-300" />
          <p className="text-sm leading-7 text-slate-100">{item}</p>
        </div>
      ))}
    </div>
  );
}

function RuleCard({
  title,
  items,
  tone,
  copyValue,
  copyLabel,
  copiedLabel,
}: {
  title: string;
  items: string[];
  tone: "check" | "warning";
  copyValue?: string;
  copyLabel?: string;
  copiedLabel?: string;
}) {
  return (
    <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{title}</p>
        {copyValue && copyLabel && copiedLabel ? (
          <CopyButton value={copyValue} label={copyLabel} copiedLabel={copiedLabel} />
        ) : null}
      </div>
      {tone === "check" ? <ChecklistList items={items} /> : <WarningList items={items} />}
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm leading-7 text-slate-200">{value}</p>
    </div>
  );
}

function findPromptTargetName(design: SubjectDesign, identifier: string) {
  const memo = new Map<string, string>();

  for (const subject of design.main_subjects) {
    memo.set(subject.id, subject.name);
  }

  for (const environment of design.environments) {
    memo.set(environment.id, environment.name);
  }

  for (const prop of design.props) {
    memo.set(prop.id, prop.name);
  }

  return memo.get(identifier) ?? null;
}
