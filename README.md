# Viral Forge

Viral Forge is a local-first web app for planning premium short-form AI video production through a guided, human-in-the-loop workflow. It keeps prompts visible and editable, validates uploaded and generated JSON with Zod, and helps creators move from brief to production-ready planning without turning the process into a black box.

## Current Workflow

The app currently supports these active stages:

- Brief
- Idea Lab
- Selected Idea
- Script Prompt
- Script
- Voiceover
- Subject Design Prompt
- Subject Design
- Reference Image Prompts
- Scene Board
- Keyframe Prompts
- Kling Prompts

Within those stages, the app already supports:

- prompt editing and reset flows
- generate / upload / paste JSON patterns
- Zod validation before save
- card-based review UIs
- standardized copy actions
- workflow dependency checks
- next-step guidance
- raw JSON inspection

Planned but still manual / coming soon:

- Test Scene Review
- Export

## Product Principles

Every AI-assisted stage follows the same pattern:

1. Prompt is shown and editable
2. User can generate inside the app, upload JSON, or paste JSON
3. JSON is validated with Zod
4. Valid output is saved to the project
5. Clean cards and copy actions are rendered for review

Viral Forge does not hide prompts, does not auto-run generation behind the scenes, and does not remove human checkpoints from the workflow.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn-style UI components
- Zod
- Local JSON file storage in `data/projects.json`
- Mock AI provider with real-provider placeholders

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

```bash
AI_PROVIDER=mock
```

`mock` is the default. The app is wired for future provider expansion, but no real image, video, or Kling API calls are executed in the current implementation.

## What Works Now

- Dashboard with project stats, workflow status, next-step guidance, and delete confirmation
- New project form with `Future Files` and `Blank Custom Project` templates
- Rich project brief fields including audience, countries, face policy, tools, budget, style notes, and negative visual rules
- Idea generation, upload, paste, comparison, and selection
- Script prompt editing, script generation, upload, paste, and validated rendering
- Voiceover review, editing, notes, duration recalculation, save, and reset
- Subject Design prompt editing plus generate/upload/paste flow
- Subject Design dashboard with review notes and sectioned production view
- Reference Image Prompts generate/upload/paste flow with reusable asset-reference prompts only
- Scene Board generate/upload/paste flow with dependency status
- Keyframe Prompts generate/upload/paste flow with dependency status and copy actions
- Kling Prompts generate/upload/paste flow with dependency status, test-scene recommendation, and copy actions
- Next-step logic that adapts to missing dependencies and warns when later stages exist without Reference Image Prompts

## Detailed Stage Coverage

### Brief and Setup

- Template-based project creation
- Future Files defaults
- Blank Custom Project option
- Expanded creative and production metadata
- Dashboard project cards with stage, next step, and last-updated context

### Idea Lab

- Mock idea generation
- Upload and paste JSON support
- Zod validation plus business-rule validation
- Select-one-idea workflow
- Selected idea checkpoint panel

### Script and Voiceover

- Editable script prompt
- Generate / upload / paste script JSON
- Script rendering with per-scene information
- Voiceover extraction and editing
- Voiceover notes persistence
- Save and reset flows for reviewed narration

### Subject Design

- Editable subject design prompt
- Generate / upload / paste subject design JSON
- Card-based subject design dashboard
- Section navigation for overview, subjects, environments, props, scene map, style guide, image readiness, and review
- Subject design review notes and reviewed timestamp

### Reference Image Prompts

- Editable reference prompt-generation prompt
- Generate / upload / paste Reference Image Prompts JSON
- Validation against allowed reusable reference types only
- Per-card prompt copy, negative prompt copy, and combined copy
- Sanitized prompt-building context so copyrighted examples in source avoid-lists do not leak into generated prompt instructions

### Scene Board

- Editable Scene Board prompt
- Generate / upload / paste Scene Board JSON
- Dependency status panel
- Per-scene production board cards
- Global continuity rules and recommended test-scene guidance

### Keyframe Prompts

- Editable Keyframe Prompts prompt
- Generate / upload / paste Keyframe Prompts JSON
- Dependency status panel
- Per-scene opening prompt, optional ending prompt, and negative prompt copy actions

### Kling Prompts

- Editable Kling Prompts prompt
- Generate / upload / paste Kling Prompts JSON
- Dependency status panel
- Missing-reference warning when later stages exist without Reference Image Prompts
- Recommended Scene 3 test shortcut
- Copy Scene 3 Kling prompt / negative prompt / combined prompt

## Important Boundaries

The current app does not:

- Call the Kling API
- Generate video files
- Generate images directly
- Run voice synthesis
- Handle auth
- Handle payments
- Use Prisma or SQLite
- Run n8n workflows

Kling prompts, keyframes, and reference prompts are planning outputs only. They are meant to be copied into external tools manually.

## Reference Image Prompts

User-facing terminology is now `Reference Image Prompts`.

Internally, some code and project fields still use `design_image_prompts` for migration safety, but the stage is presented in the UI as Reference Image Prompts.

This stage is intentionally limited to reusable asset references such as:

- Robot full-body reference
- Robot face close-up reference
- Environment reference
- Door / hallway prop reference
- Global cinematic style reference

It does not create scene-specific keyframes or video prompts.

Allowed Reference Image Prompt types are:

- `subject_full_body_reference`
- `subject_closeup_reference`
- `environment_reference`
- `prop_reference`
- `style_reference`

## Prompt Safety and Sanitization

Reference Image Prompts, Keyframe Prompts, and Kling Prompts use sanitized source context before prompt-building so avoid-list examples do not leak copyrighted or brand terms into downstream prompts.

Examples of sanitization include:

- `C-3PO` -> `famous gold humanoid robot`
- `R2-D2` -> `famous small dome-shaped robot`
- `Baymax` -> `famous soft white medical robot`
- `Chappie` -> `famous gritty humanoid robot`
- `Apple` -> `premium minimalist consumer-tech aesthetic`
- `Black Mirror` -> `unsettling near-future anthology tone`

Final generated Reference Image Prompts are still validated and rejected if copyrighted names, celebrities, franchise names, or brand terms appear in the saved prompt fields.

## Workflow Dependency Logic

The intended project flow is:

1. Brief
2. Idea Lab
3. Selected Idea
4. Script Prompt
5. Script
6. Voiceover
7. Subject Design Prompt
8. Subject Design
9. Reference Image Prompts
10. Scene Board
11. Keyframe Prompts
12. Kling Prompts
13. Test Scene Review
14. Export

Important dependency behavior:

- Later stages can still exist even if Reference Image Prompts were skipped earlier
- In that case the app warns that consistency may be weaker
- Next-step guidance prefers creating Reference Image Prompts before more regeneration work
- Scene Board, Keyframe Prompts, and Kling Prompts all show dependency panels

## Local Storage

Projects are stored in:

```text
data/projects.json
```

The storage layer auto-creates the `data` directory and initializes `projects.json` as `[]` if it does not exist.

## Main Project Data

Projects currently persist workflow state for:

- Brief metadata
- Idea generation and selection
- Script prompt and script output
- Edited voiceover and notes
- Subject design prompt and subject design output
- Subject design review notes
- Reference Image Prompts prompt and output
- Scene Board prompt and output
- Keyframe Prompts prompt and output
- Kling Prompts prompt and output

Key persisted review/support fields also include:

- `voiceover_notes`
- `subject_design_review_notes`
- `subject_design_reviewed_at`
- source tracking for generated / uploaded / pasted stage outputs

## Key API Routes

Core routes already implemented include:

- `POST /api/projects`
- `GET /api/projects/[id]`
- `POST /api/projects/[id]/generate-ideas`
- `POST /api/projects/[id]/upload-idea-json`
- `PATCH /api/projects/[id]/script-prompt`
- `POST /api/projects/[id]/generate-script`
- `POST /api/projects/[id]/upload-script-json`
- `PATCH /api/projects/[id]/voiceover`
- `PATCH /api/projects/[id]/subject-design-prompt`
- `POST /api/projects/[id]/generate-subject-design`
- `POST /api/projects/[id]/upload-subject-design-json`
- `PATCH /api/projects/[id]/subject-design-review`
- `PATCH /api/projects/[id]/design-image-prompts-prompt`
- `POST /api/projects/[id]/generate-design-image-prompts`
- `POST /api/projects/[id]/upload-design-image-prompts-json`
- `PATCH /api/projects/[id]/scene-board-prompt`
- `POST /api/projects/[id]/generate-scene-board`
- `POST /api/projects/[id]/upload-scene-board-json`
- `PATCH /api/projects/[id]/keyframe-prompts-prompt`
- `POST /api/projects/[id]/generate-keyframe-prompts`
- `POST /api/projects/[id]/upload-keyframe-prompts-json`
- `PATCH /api/projects/[id]/kling-prompts-prompt`
- `POST /api/projects/[id]/generate-kling-prompts`
- `POST /api/projects/[id]/upload-kling-prompts-json`

## Mock Mode

Mock mode returns valid structured JSON for:

- ideas
- script generation
- subject design
- reference image prompts
- scene board
- keyframe prompts
- Kling prompts

This makes the full planning workflow testable locally without external providers.

## Manual-Only Stages

Even though the app now plans later production stages, these remain manual:

- image generation in external tools
- keyframe generation in external tools
- Kling prompt usage in external tools
- test scene review execution
- final scene generation
- export packaging

## Future Extension Points

The repo is structured to support later expansion without rewriting the foundation:

- `lib/ai/*`
  Provider wrappers and mock/placeholder implementations for each stage
- `lib/prompts/*`
  Prompt builders for each generation stage
- `lib/schemas/*`
  Zod schemas and business-rule validation
- `lib/storage/projects.ts`
  Single-file local storage layer and a strong seam for future DB migration
- `app/projects/[id]/page.tsx`
  Main workflow shell

## Before Pushing

Recommended checks:

```bash
npm run lint
npm run build
```

Both should pass before shipping changes.
