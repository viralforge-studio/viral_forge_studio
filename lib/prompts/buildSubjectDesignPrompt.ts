import { type Idea } from "@/lib/schemas/ideas";
import { type Project } from "@/lib/schemas/project";
import { type ScriptGeneration } from "@/lib/schemas/script";

export function buildSubjectDesignPrompt(
  project: Project,
  selectedIdea: Idea,
  scriptGeneration: ScriptGeneration,
  editedVoiceover: string | null,
) {
  const voiceover = editedVoiceover ?? scriptGeneration.voiceover.clean_script ?? scriptGeneration.full_voiceover;

  const schemaExample = {
    generation_timestamp: "ISO 8601 timestamp",
    project_id: project.id,
    channel: project.channel_name,
    idea_id: selectedIdea.id,
    source_idea_title: selectedIdea.title,
    source_script_title: scriptGeneration.title,
    visual_style_summary: "One paragraph summary of the visual identity for this video.",
    design_goal: "The purpose of this design package.",
    main_subjects: [
      {
        id: "subject_robot_01",
        name: "Domestic companion robot",
        type: "robot",
        role_in_story: "Primary emotional subject of the video.",
        description: "Detailed visual description.",
        silhouette: "Description of recognizable shape.",
        materials: ["material 1", "material 2"],
        colors: ["color 1", "color 2"],
        lighting_interaction: "How lighting interacts with this subject.",
        age_or_condition: "pristine",
        emotion_to_convey: "Primary emotion this subject should communicate visually.",
        face_policy: "How to handle face/expressiveness safely.",
        consistency_rules: ["Rule 1", "Rule 2", "Rule 3"],
        avoid: [
          "Avoid copyrighted design resemblance.",
          "Avoid logos or readable markings.",
        ],
      },
    ],
    environments: [
      {
        id: "env_apartment_01",
        name: "Abandoned futuristic apartment",
        role_in_story: "Primary location.",
        description: "Detailed environment description.",
        architecture_style: "Architecture style.",
        materials: ["material 1", "material 2"],
        color_palette: ["color 1", "color 2", "color 3"],
        lighting: "Lighting description.",
        mood: "Mood description.",
        continuity_rules: ["Rule 1", "Rule 2"],
        avoid: ["No logos.", "No readable text."],
      },
    ],
    props: [
      {
        id: "prop_door_01",
        name: "Apartment door",
        role_in_story: "Important story object.",
        description: "Detailed prop description.",
        visual_rules: ["Rule 1", "Rule 2"],
        avoid: ["No readable labels."],
      },
    ],
    scene_design_map: [
      {
        scene_number: 1,
        scene_role: "Hook",
        required_subjects: ["subject_robot_01"],
        required_environments: ["env_apartment_01"],
        required_props: ["prop_door_01"],
        design_focus: "What design continuity matters in this scene.",
        continuity_notes: "What must stay consistent.",
      },
      {
        scene_number: 2,
        scene_role: "Setup",
        required_subjects: ["subject_robot_01"],
        required_environments: ["env_apartment_01"],
        required_props: ["prop_door_01"],
        design_focus: "What design continuity matters in this scene.",
        continuity_notes: "What must stay consistent.",
      },
      {
        scene_number: 3,
        scene_role: "Build",
        required_subjects: ["subject_robot_01"],
        required_environments: ["env_apartment_01"],
        required_props: ["prop_door_01"],
        design_focus: "What design continuity matters in this scene.",
        continuity_notes: "What must stay consistent.",
      },
      {
        scene_number: 4,
        scene_role: "Tension",
        required_subjects: ["subject_robot_01"],
        required_environments: ["env_apartment_01"],
        required_props: ["prop_door_01"],
        design_focus: "What design continuity matters in this scene.",
        continuity_notes: "What must stay consistent.",
      },
      {
        scene_number: 5,
        scene_role: "Twist / Emotional Reveal",
        required_subjects: ["subject_robot_01"],
        required_environments: ["env_apartment_01"],
        required_props: ["prop_door_01"],
        design_focus: "What design continuity matters in this scene.",
        continuity_notes: "What must stay consistent.",
      },
    ],
    global_style_guide: {
      camera_language: "Camera language for future keyframe and Kling prompts.",
      lighting_language: "Lighting language for all scenes.",
      texture_language: "Texture and material language.",
      mood_keywords: ["keyword 1", "keyword 2", "keyword 3"],
      negative_style_rules: [
        "No neon cyberpunk.",
        "No cartoon look.",
        "No logos.",
        "No readable text.",
      ],
    },
    image_generation_readiness: {
      recommended_first_design_image: "subject_robot_01",
      why: "Why this should be designed first.",
      reference_image_prompt_seed:
        "A concise starter prompt seed for later image generation, not a final image prompt.",
    },
    human_review: {
      needs_review: true,
      review_questions: [
        "Does the main subject feel original?",
        "Can the design stay consistent across all scenes?",
        "Is the silhouette clear enough for vertical video?",
      ],
    },
  };

  return `You are a cinematic AI video art director for faceless short-form AI videos.

You specialize in:
- realistic cinematic future design
- original robot, subject, prop, and environment design
- visual continuity across AI-generated scenes
- Kling AI and image-generation-friendly design language
- premium sci-fi aesthetics
- low-artifact visual planning
- human-in-the-loop AI video workflows

CHANNEL CONTEXT

Channel:
${project.channel_name}

Project template:
${project.project_template}

Niche:
${project.niche}

Positioning:
${project.positioning}

Audience:
${project.audience}

Target countries:
${JSON.stringify(project.target_countries, null, 2)}

Language:
${project.language}

Tone:
${project.tone}

Visual style:
${project.visual_style}

Reference style notes:
${project.reference_style_notes || "None provided"}

Face policy:
${project.face_policy || "None provided"}

CTA style:
${project.cta_style || "None provided"}

Platform:
${project.platform}

Video format:
${project.video_format}

Primary AI video tool:
${project.primary_ai_video_tool || "Not specified"}

Image generation tool:
${project.image_generation_tool || "Not specified"}

Budget range:
${project.budget_range || "Not specified"}

Target duration:
${project.target_duration_seconds} seconds

Scene count:
${project.scene_count}

SELECTED IDEA

Idea title:
${selectedIdea.title}

Hook:
${selectedIdea.hook}

Concept:
${selectedIdea.concept}

Emotional triggers:
${JSON.stringify(selectedIdea.emotional_triggers, null, 2)}

Virality mechanics:
${JSON.stringify(selectedIdea.virality_mechanics, null, 2)}

Target comment hook:
${selectedIdea.target_comment_hook}

FULL SELECTED IDEA JSON

${JSON.stringify(selectedIdea, null, 2)}

SCRIPT GENERATION JSON

Use this script as the source of truth for visual design:

${JSON.stringify(scriptGeneration, null, 2)}

FINAL / EDITED VOICEOVER

Use this voiceover for emotional and pacing context:

${voiceover}

TASK

Create a reusable subject and environment design package for this video.

You are not generating image prompts yet.
You are not generating Kling prompts yet.
You are not generating images.
You are not generating video.

You are defining consistent visual identities that later tabs will use for:
- image/keyframe prompts
- Kling scene prompts
- scene board planning
- manual creative review

DESIGN REQUIREMENTS

Create designs that are:
- visually specific
- original
- cinematic
- easy for AI tools to understand
- consistent across all scenes
- suitable for vertical 9:16 video
- suitable for realistic cinematic future style
- suitable for Kling and image keyframes later
- emotionally aligned with the script

For human subjects:
- Avoid clear face dependency.
- Prefer silhouettes, backs, reflections, blurred profiles, or distant figures.
- Do not require facial micro-expressions.
- Do not identify a real person.
- Do not resemble celebrities.

For robots:
- Avoid copyrighted robot designs.
- Avoid looking like famous movie robots.
- Express emotion through posture, sensor glow, stillness, wear, framing, and lighting.

For environments:
- Keep continuity across scenes.
- Make the location specific but not overcomplicated.
- Avoid readable text, logos, or brand-like elements.

For props:
- Describe shape, material, light behavior, and role in story.
- Avoid text labels or tiny readable UI.

OUTPUT FORMAT

Return VALID JSON ONLY.
No markdown.
No explanation.
No preamble.
No trailing commas.
Do not wrap JSON in code fences.

STRICT OUTPUT RULES

- Output must be valid JSON.
- idea_id must match the selected idea id.
- source_script_title must match scriptGeneration.title.
- main_subjects must include at least 1 subject.
- environments must include at least 1 environment.
- scene_design_map must contain exactly ${project.scene_count} scene mappings.
- Do not include brand names.
- Do not include copyrighted character names.
- Do not include celebrity likeness.
- Do not require readable text.
- Do not require detailed facial acting.
- Do not create Kling prompts.
- Do not create image prompts.

JSON SCHEMA TO FOLLOW

${JSON.stringify(schemaExample, null, 2)}

FINAL QUALITY CHECK BEFORE RESPONDING

Before returning JSON, silently verify:
- The output is valid JSON.
- idea_id matches the selected idea.
- source_script_title matches the script title.
- main_subjects contains at least one subject.
- environments contains at least one environment.
- scene_design_map contains exactly ${project.scene_count} scenes.
- The design is original and not based on copyrighted characters.
- The design avoids logos and readable text.
- Human faces are not required.
- The design is useful for future image and Kling prompts.
- The output contains JSON only.`;
}
