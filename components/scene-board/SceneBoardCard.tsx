import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type SceneBoardScene } from "@/lib/schemas/scene-board";

function Block({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="text-sm leading-7 text-slate-200">{value}</p>
    </div>
  );
}

function Tags({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="grid gap-2">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <Badge key={`${label}-${value}`}>{value}</Badge>
        ))}
      </div>
    </div>
  );
}

export function SceneBoardCard({ scene }: { scene: SceneBoardScene }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="accent">Scene {scene.scene_number}</Badge>
            <Badge>{scene.scene_role}</Badge>
            <Badge>{scene.duration_sec}s</Badge>
          </div>
          <CardTitle className="text-base">{scene.visual_goal}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Block label="Voiceover Line" value={scene.voiceover_line} />
        <Block label="Visual Goal" value={scene.visual_goal} />
        <Tags label="Required Subjects" values={scene.required_subjects} />
        <Tags label="Required Environments" values={scene.required_environments} />
        <Tags label="Required Props" values={scene.required_props} />
        <Tags label="Design References" values={scene.design_references} />
        <Block label="Camera Framing" value={scene.camera_framing} />
        <Block label="Lighting Plan" value={scene.lighting_plan} />
        <Block label="Composition Notes" value={scene.composition_notes} />
        <Tags label="Continuity Rules" values={scene.continuity_rules} />
        <Tags label="Risk Notes" values={scene.risk_notes} />
        <Tags label="Human Review Checklist" values={scene.human_review_checklist} />
      </CardContent>
    </Card>
  );
}
