import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type MainSubject } from "@/lib/schemas/subject-design";

export function SubjectCard({ subject }: { subject: MainSubject }) {
  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="accent">{subject.type}</Badge>
          <Badge>{subject.age_or_condition}</Badge>
        </div>
        <CardTitle>{subject.name}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 text-sm">
        <Line label="Role in Story" value={subject.role_in_story} />
        <Line label="Description" value={subject.description} />
        <Line label="Silhouette" value={subject.silhouette} />
        <Line label="Lighting Interaction" value={subject.lighting_interaction} />
        <Line label="Emotion to Convey" value={subject.emotion_to_convey} />
        <Line label="Face Policy" value={subject.face_policy} />
        <TokenLine label="Materials" items={subject.materials} />
        <TokenLine label="Colors" items={subject.colors} />
        <TokenLine label="Consistency Rules" items={subject.consistency_rules} />
        <TokenLine label="Avoid" items={subject.avoid} />
      </CardContent>
    </Card>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="text-slate-200">{value}</p>
    </div>
  );
}

function TokenLine({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="grid gap-2">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge key={item}>{item}</Badge>
        ))}
      </div>
    </div>
  );
}
