# Viral Forge Studio Architecture and Feature Context

This document captures the current product, code architecture, workflow model, and extension points for adding advanced features to Viral Forge Studio.

## Product Summary

Viral Forge Studio is a local-first planning app for premium short-form AI video production. It guides a creator from a project brief through idea generation, script planning, voiceover review, subject design, reusable reference image prompts, scene boards, keyframe prompts, and Kling video prompts.

The product is intentionally human-in-the-loop. Prompts are visible, editable, resettable, and auditable. Generated or uploaded JSON is validated before it becomes project state. The app does not currently generate images, synthesize voice, call Kling, render video, handle auth, or package final exports.

## Current Stack

- Next.js App Router, `next@16.2.6`
- React 19
- TypeScript
- Tailwind CSS 4
- Zod 4
- Local JSON file persistence in `data/projects.json`
- shadcn-style local UI primitives
- Mock AI providers with placeholder real-provider modules

Important repo instruction: this project uses a newer Next.js version with changed conventions. Before changing Next.js APIs, route handlers, file structure, navigation behavior, or caching behavior, read the relevant docs under `node_modules/next/dist/docs/`.

## Repository Map

```text
app/
  page.tsx
  layout.tsx
  globals.css
  projects/
    new/page.tsx
    [id]/page.tsx
  api/projects/
    route.ts
    [id]/
      route.ts
      generate-ideas/route.ts
      select-idea/route.ts
      script-prompt/route.ts
      generate-script/route.ts
      upload-script-json/route.ts
      voiceover/route.ts
      subject-design-prompt/route.ts
      generate-subject-design/route.ts
      upload-subject-design-json/route.ts
      subject-design-review/route.ts
      design-image-prompts-prompt/route.ts
      generate-design-image-prompts/route.ts
      upload-design-image-prompts-json/route.ts
      scene-board-prompt/route.ts
      generate-scene-board/route.ts
      upload-scene-board-json/route.ts
      keyframe-prompts-prompt/route.ts
      generate-keyframe-prompts/route.ts
      upload-keyframe-prompts-json/route.ts
      kling-prompts-prompt/route.ts
      generate-kling-prompts/route.ts
      upload-kling-prompts-json/route.ts
components/
  common/
  ui/
  workflow/
  project/
  ideas/
  script/
  voiceover/
  subject-design/
  design-image-prompts/
  scene-board/
  keyframe-prompts/
  kling-prompts/
lib/
  ai/
  prompts/
  schemas/
  storage/
  utils/
  workflow.ts
data/
  projects.json
```

## Runtime Architecture

The app is built around Next.js Server Components and route handlers.

- Dashboard: `app/page.tsx` reads projects from local storage and renders project cards plus workflow stats.
- Project workspace: `app/projects/[id]/page.tsx` loads a project, resolves the active workflow tab, lazily ensures prompt text for prompt stages, and renders the matching workflow panel.
- API routes: `app/api/projects/**/route.ts` handle generation, upload, paste, reset, review, save, update, and delete operations.
- Storage and workflow mutation: `lib/storage/projects.ts` owns local file reads/writes and most project state transitions.
- Workflow helpers: `lib/workflow.ts` owns tab metadata, completion checks, availability checks, status labels, next-step guidance, and missing Reference Image Prompts warnings.
- Prompt builders: `lib/prompts/*` build editable prompts for each AI-assisted stage.
- Schemas: `lib/schemas/*` define project shape and generated/uploaded JSON contracts.
- AI wrappers: `lib/ai/generate*.ts` select a provider and validate provider output through Zod.
- AI providers: `lib/ai/providers/*` currently contain mocks plus placeholders for future real providers.

## Data Model

The canonical persisted object is `Project`, defined in `lib/schemas/project.ts`.

Core project fields:

- `id`
- `project_template`
- `project_name`
- `channel_name`
- `niche`
- `positioning`
- `audience`
- `tone`
- `visual_style`
- `content_pillars`
- `blocked_topics`
- `target_countries`
- `language`
- `video_format`
- `face_policy`
- `cta_style`
- `budget_range`
- `primary_ai_video_tool`
- `image_generation_tool`
- `reference_style_notes`
- `negative_visual_rules`
- `target_duration_seconds`
- `scene_count`
- `platform`
- `status`
- `created_at`
- `updated_at`

Workflow state fields:

- `idea_generation`
- `selected_idea_id`
- `script_prompt`
- `script_prompt_updated_at`
- `script_generation`
- `script_generation_source`
- `edited_voiceover`
- `voiceover_updated_at`
- `voiceover_notes`
- `subject_design_prompt`
- `subject_design_prompt_updated_at`
- `subject_design`
- `subject_design_source`
- `subject_design_review_notes`
- `subject_design_reviewed_at`
- `design_image_prompt_generation_prompt`
- `design_image_prompt_generation_prompt_updated_at`
- `design_image_prompts`
- `design_image_prompts_source`
- `scene_board_prompt`
- `scene_board_prompt_updated_at`
- `scene_board`
- `scene_board_source`
- `keyframe_prompts_prompt`
- `keyframe_prompts_prompt_updated_at`
- `keyframe_prompts`
- `keyframe_prompts_source`
- `kling_prompts_prompt`
- `kling_prompts_prompt_updated_at`
- `kling_prompts`
- `kling_prompts_source`

Source tracking fields use:

- `generated`
- `uploaded`
- `pasted`

## Workflow Statuses

Project statuses are defined by `ProjectStatusSchema`:

```text
brief_created
ideas_generated
idea_selected
script_prompt_ready
script_generated
voiceover_reviewed
subject_design_prompt_ready
subject_design_ready
design_image_prompts_ready
scene_board_ready
keyframe_prompts_ready
kling_prompts_ready
test_scene_review
ready_for_export
```

The intended stage order is:

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

`Test Scene Review` and `Export` are visible future stages but are not fully implemented.

## Current Feature Set

### Dashboard

- Lists all projects from `data/projects.json`
- Shows total, in-progress, ready-for-prompting, and ready-for-export counts
- Renders project cards
- Supports deleting projects through a confirmation UI
- Links to new project creation and existing project workspaces

### Project Creation

- Supports `Future Files` and `Blank Custom Project` templates
- Captures creative brief, audience, style, platform, target duration, scene count, and production constraints
- Persists a new project with initial `brief_created` status

### Idea Lab

- Generates mock idea JSON
- Uploads or pastes idea JSON
- Validates idea structure with Zod
- Applies business-rule validation
- Allows selecting one idea
- Clears downstream work when selection changes or generated ideas no longer contain the previous selection

### Script Prompt

- Builds an editable script-generation prompt from project brief and selected idea
- Saves prompt edits
- Resets prompt to generated default

### Script

- Generates mock script JSON
- Uploads or pastes script JSON
- Validates script output
- Renders generated script content
- Clears downstream voiceover, subject design, reference prompt, scene board, keyframe, and Kling state when a new script is saved

### Voiceover

- Extracts default voiceover from script output
- Allows editing narration
- Allows saving production notes
- Recalculates and stores reviewed narration state
- Supports resetting edited voiceover from script output

### Subject Design Prompt

- Builds editable subject-design prompt from selected idea, script, and optional edited voiceover
- Saves prompt edits
- Resets prompt to default

### Subject Design

- Generates mock subject-design JSON
- Uploads or pastes subject-design JSON
- Validates generated or imported output
- Renders overview, subjects, environments, props, scene map, style guide, image readiness, and review content
- Supports subject design review notes and reviewed timestamp
- Clears later planning stages when subject design changes

### Reference Image Prompts

User-facing terminology is `Reference Image Prompts`. Some internal code still uses `design_image_prompts` for migration safety.

- Builds editable prompt-generation prompt
- Generates mock Reference Image Prompts JSON
- Uploads or pastes Reference Image Prompts JSON
- Validates reusable reference prompt types
- Provides copy actions for prompt, negative prompt, and combined prompt
- Warns when later stages exist without Reference Image Prompts
- Uses sanitized prompt-building context to prevent known copyrighted or brand examples from leaking into generated prompt instructions

Allowed reference prompt types:

- `subject_full_body_reference`
- `subject_closeup_reference`
- `environment_reference`
- `prop_reference`
- `style_reference`

### Scene Board

- Builds editable Scene Board prompt
- Generates mock Scene Board JSON
- Uploads or pastes Scene Board JSON
- Validates scene board output
- Shows dependency status
- Renders per-scene production board cards
- Includes global continuity rules and recommended test-scene guidance
- Clears keyframe and Kling state when Scene Board changes

### Keyframe Prompts

- Builds editable Keyframe Prompts prompt
- Generates mock keyframe prompt JSON
- Uploads or pastes keyframe prompt JSON
- Validates output
- Shows dependency status
- Renders per-scene opening prompt, optional ending prompt, and negative prompt
- Provides copy actions
- Clears Kling state when keyframes change

### Kling Prompts

- Builds editable Kling Prompts prompt
- Generates mock Kling prompt JSON
- Uploads or pastes Kling prompt JSON
- Validates output
- Shows dependency status
- Provides recommended Scene 3 test shortcut
- Provides copy actions for Scene 3 prompt, negative prompt, and combined prompt
- Saves status as `kling_prompts_ready`

## API Route Patterns

Most API routes follow one of these patterns:

- Ensure dependency state exists
- Parse request JSON
- Validate request payload with Zod
- Call a generation wrapper or storage mutation
- Return updated project JSON
- Return formatted Zod validation errors on invalid JSON
- Return project-not-found errors as `404`
- Return workflow dependency errors as `400`

Route handlers use the Next.js 16 dynamic params convention:

```ts
{ params }: { params: Promise<{ id: string }> }
```

and then:

```ts
const { id } = await params;
```

## Storage Layer

`lib/storage/projects.ts` currently owns:

- Creating `data/` and `data/projects.json` when missing
- Reading and parsing all projects
- Writing all projects
- Creating projects
- Updating and deleting projects
- Selecting ideas
- Ensuring default prompts
- Saving prompt edits
- Resetting prompts
- Saving generated/uploaded/pasted workflow outputs
- Clearing stale downstream stages after upstream changes
- Updating status and timestamps

Persistence is file-based and uses a read-modify-write pattern. This is simple and useful for local development, but it has no locking or transaction semantics.

## Validation Architecture

Validation is handled through Zod schemas in `lib/schemas/*`.

Important validation modules:

- `project.ts`: project and new-project input schemas
- `ideas.ts`: idea generation schema and business rules
- `script.ts`: script generation schema
- `subject-design.ts`: subject design schema
- `design-image-prompts.ts`: Reference Image Prompts schema
- `scene-board.ts`: Scene Board schema
- `keyframe-prompts.ts`: Keyframe Prompts schema
- `kling-prompts.ts`: Kling Prompts schema
- `validation.ts`: formats Zod issues for API responses

Business-rule validation exists for ideas and Reference Image Prompt safety rules.

## Prompt Safety

Some prompt builders sanitize source context before building downstream prompt instructions. The goal is to avoid leaking copyrighted names, franchise names, celebrities, and brand terms from brief examples into final prompt instructions.

Known examples are mapped to generic descriptors, such as:

- `C-3PO` to `famous gold humanoid robot`
- `R2-D2` to `famous small dome-shaped robot`
- `Baymax` to `famous soft white medical robot`
- `Apple` to `premium minimalist consumer-tech aesthetic`
- `Black Mirror` to `unsettling near-future anthology tone`

Generated Reference Image Prompts are still validated and rejected if blocked protected terms appear in saved prompt fields.

## AI Provider Architecture

Each AI stage has a wrapper in `lib/ai/generate*.ts`.

The wrappers:

- Read `process.env.AI_PROVIDER`
- Default to `mock`
- Call the mock provider when `AI_PROVIDER=mock`
- Call placeholder LLM provider modules otherwise
- Parse provider output with the relevant Zod schema before returning

Current provider mode:

```text
AI_PROVIDER=mock
```

Implemented mock provider outputs:

- ideas
- script generation
- subject design
- Reference Image Prompts
- Scene Board
- Keyframe Prompts
- Kling Prompts

Real-provider integration is intentionally not implemented yet.

## UI Architecture

The project uses stage-specific panels backed by shared UI primitives.

Shared UI primitives:

- `button`
- `card`
- `badge`
- `alert`
- `input`
- `textarea`
- `label`
- `separator`
- `scroll-area`

Shared utility components:

- `CopyButton`
- `DifficultyBadge`
- `JsonViewer`
- `ScoreBadge`
- `StatusBadge`
- `StickyActionBar`

Workflow UI:

- `WorkflowSidebar`
- `WorkflowProgress`
- `DependencyStatusPanel`

Stage UI directories:

- `components/ideas`
- `components/script`
- `components/voiceover`
- `components/subject-design`
- `components/design-image-prompts`
- `components/scene-board`
- `components/keyframe-prompts`
- `components/kling-prompts`

Most stages share a repeated product pattern:

- Show the editable prompt when relevant
- Generate inside the app
- Upload JSON
- Paste JSON
- Validate JSON
- Persist valid output
- Render clean review cards
- Offer copy actions
- Show raw JSON for inspection

## Known Technical Risks

### Monolithic Project Storage Module

`lib/storage/projects.ts` is large and combines repository behavior, workflow transition rules, prompt orchestration, validation assumptions, and persistence details. Future advanced features will be easier if this is split into smaller modules.

Suggested future split:

- `lib/storage/projectRepository.ts`
- `lib/workflow/projectTransitions.ts`
- `lib/workflow/stageDependencies.ts`
- `lib/workflow/stageInvalidation.ts`
- `lib/services/projectWorkflowService.ts`

### Broad Project PATCH Endpoint

`PATCH /api/projects/[id]` accepts `ProjectSchema.partial()`. This allows broad mutation of server-owned fields if called directly.

Safer future approach:

- Create explicit DTO schemas for editable brief fields
- Keep status, timestamps, source tracking, and generated artifacts behind dedicated route handlers

### File-Based Concurrency

The JSON storage layer has no locking. Two parallel route calls can read the same file and write conflicting updates.

Advanced features that create more parallel work should consider:

- SQLite
- Postgres
- optimistic concurrency with `updated_at`
- a write queue or mutex for local-only mode

### Status and Artifact Drift

Status is persisted separately from the presence of workflow artifacts. Because artifacts can be reset or cleared, status and actual completeness can drift if future routes do not maintain transitions carefully.

Future direction:

- Derive progress from artifact presence where possible
- Keep persisted status only for explicit manual milestones
- Centralize stage invalidation rules

### Repeated Upload/Paste/Generate Patterns

Many stages duplicate similar UI and route behavior for prompt editing, upload, paste, generate, validation, and persistence.

Future direction:

- Introduce reusable stage configuration
- Create common upload/paste dialog logic
- Create shared route helpers for Zod parse and API error formatting

### Missing Automated Tests

There is currently no visible test suite. The highest-value tests would cover:

- project creation defaults
- selecting an idea clears downstream state
- saving script clears downstream state
- saving subject design clears scene/keyframe/Kling state
- saving scene board clears keyframe/Kling state
- saving keyframes clears Kling state
- route validation errors
- Reference Image Prompt blocked-term validation
- next-step guidance from `lib/workflow.ts`

## Advanced Feature Extension Points

### Real AI Provider Integration

Best place to start:

- `lib/ai/providers/*-llm-placeholder.ts`
- `lib/ai/generate*.ts`

Implementation notes:

- Keep Zod validation after provider response
- Preserve mock mode for offline testing
- Add provider-specific error mapping
- Add request/response logging carefully, avoiding secret leakage
- Consider streaming only for stages with useful incremental UI

### Project Database Migration

Best place to start:

- Replace internals of `lib/storage/projects.ts`
- Keep exported function signatures stable at first

Recommended migration path:

1. Introduce repository interface.
2. Move file persistence behind file repository implementation.
3. Add SQLite or Postgres repository implementation.
4. Switch service layer to repository interface.
5. Add migrations and seed data.

### Auth and Multi-User Projects

New concepts needed:

- users
- project ownership
- workspace/team membership
- role-based access
- private/public project visibility

Routes will need authorization checks before reading or mutating project state.

### Media Asset Library

Useful for future image/video generation:

- generated reference images
- uploaded reference images
- keyframe stills
- test scene videos
- final scene videos
- thumbnails
- metadata for prompt, seed, model, provider, and generation cost

Likely new directories/modules:

- `lib/assets`
- `lib/media`
- `app/api/projects/[id]/assets`
- `components/assets`

### Image Generation

Reference Image Prompts are ready to become the input layer for image generation.

Needed additions:

- provider abstraction for image models
- asset persistence
- generation job state
- retry/error UI
- selected reference image per prompt
- safety and brand-term validation before generation

### Kling or Video Provider Integration

Kling Prompts are ready to become the input layer for manual or automated video generation.

Needed additions:

- provider client
- job submission
- polling or webhook handling
- scene-level status
- video asset persistence
- test scene scoring
- regeneration notes
- cost and duration tracking

### Test Scene Review

The current workflow already points toward Scene 3 as a recommended test scene.

Likely data fields:

- `test_scene_id`
- `test_scene_video_asset_id`
- `test_scene_score`
- `test_scene_notes`
- `test_scene_reviewed_at`
- `test_scene_decision`

Useful decisions:

- approve and continue
- revise Kling prompt
- revise keyframes
- revise scene board
- revise subject design

### Export

Future export can package:

- brief
- selected idea
- script
- edited voiceover
- subject design
- Reference Image Prompts
- Scene Board
- Keyframe Prompts
- Kling Prompts
- test scene review
- production checklist
- asset manifest

Useful formats:

- Markdown
- JSON
- CSV scene list
- ZIP bundle
- PDF production brief

### Collaboration and Review

Potential features:

- comments per stage
- approval state per stage
- version history
- prompt diff view
- generated output diff view
- reviewer assignment
- project activity log

### Versioning and Regeneration History

The current model stores only the latest artifact for each stage. Advanced regeneration will benefit from versioned artifacts.

Possible model:

- project has current artifact IDs
- artifact table stores `stage`, `version`, `source`, `input_prompt`, `output_json`, `created_at`
- generated media stores provider metadata and links back to artifact versions

## Suggested Refactor Roadmap

1. Add automated tests for workflow transitions.
2. Extract a repository layer from `lib/storage/projects.ts`.
3. Centralize stage invalidation rules.
4. Restrict the broad PATCH route to explicit editable fields.
5. Add versioned artifacts for generated JSON.
6. Add asset storage for images and videos.
7. Add real provider clients behind existing `lib/ai` wrappers.
8. Implement Test Scene Review.
9. Implement Export packaging.
10. Migrate from local JSON to SQLite or Postgres when concurrency or multi-user work becomes important.

## Development Checks

Recommended checks before shipping changes:

```bash
npm run lint
npm run build
```

Current observed state during architecture review:

- `npm run lint` passes.
- `package-lock.json` was already modified in the working tree before this document was added.

