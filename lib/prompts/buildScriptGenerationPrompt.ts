import { type Idea } from "@/lib/schemas/ideas";
import { type Project } from "@/lib/schemas/project";

export function buildScriptGenerationPrompt(project: Project, selectedIdea: Idea) {
  const selectedIdeaJson = JSON.stringify(selectedIdea, null, 2);
  const sceneCount = 5;

  const schemaExample = {
    generation_timestamp: "ISO 8601 timestamp",
    project_id: project.id,
    channel: project.channel_name,
    idea_id: selectedIdea.id,
    source_idea_title: selectedIdea.title,
    title: "Final short video title",
    opening_hook: "Final hook sentence",
    story_summary: "One paragraph summary of the full short.",
    script_voice: "Description of narration style and pacing.",
    full_voiceover:
      "Clean narration-only script with no scene labels or camera directions.",
    voiceover: {
      clean_script: "Same clean narration, ready to copy into voiceover recording.",
      estimated_word_count: 100,
      delivery_style: "calm, cinematic, mysterious",
      pace: "slow-medium",
      pause_notes: [
        "Pause briefly after the hook.",
        "Leave a longer pause before the final reveal.",
      ],
    },
    scenes: [
      {
        scene_number: 1,
        duration_sec: 6,
        scene_role: "Hook",
        slug: "short-scene-slug",
        narration: "Narration line for this scene.",
        visual_summary: "Simple cinematic description of what the viewer sees.",
        emotional_purpose: "What the viewer should feel in this scene.",
        visual_goal: "What this scene must clearly communicate visually.",
        editor_text_overlay_suggestion: "Optional short text added in editing only.",
        sound_design_notes: "Suggested sound or ambience for manual editing.",
        transition_notes: "How this scene should cut or transition.",
        continuity_notes: "What should remain consistent with other scenes.",
        kling_risk_notes: "Visual risks to avoid later when creating prompts.",
        source_idea_scene_reference: "Which original idea scene this came from.",
      },
      {
        scene_number: 2,
        duration_sec: 7,
        scene_role: "Setup",
        slug: "short-scene-slug",
        narration: "Narration line for this scene.",
        visual_summary: "Simple cinematic description of what the viewer sees.",
        emotional_purpose: "What the viewer should feel in this scene.",
        visual_goal: "What this scene must clearly communicate visually.",
        editor_text_overlay_suggestion: "Optional short text added in editing only.",
        sound_design_notes: "Suggested sound or ambience for manual editing.",
        transition_notes: "How this scene should cut or transition.",
        continuity_notes: "What should remain consistent with other scenes.",
        kling_risk_notes: "Visual risks to avoid later when creating prompts.",
        source_idea_scene_reference: "Which original idea scene this came from.",
      },
      {
        scene_number: 3,
        duration_sec: 7,
        scene_role: "Build",
        slug: "short-scene-slug",
        narration: "Narration line for this scene.",
        visual_summary: "Simple cinematic description of what the viewer sees.",
        emotional_purpose: "What the viewer should feel in this scene.",
        visual_goal: "What this scene must clearly communicate visually.",
        editor_text_overlay_suggestion: "Optional short text added in editing only.",
        sound_design_notes: "Suggested sound or ambience for manual editing.",
        transition_notes: "How this scene should cut or transition.",
        continuity_notes: "What should remain consistent with other scenes.",
        kling_risk_notes: "Visual risks to avoid later when creating prompts.",
        source_idea_scene_reference: "Which original idea scene this came from.",
      },
      {
        scene_number: 4,
        duration_sec: 7,
        scene_role: "Tension",
        slug: "short-scene-slug",
        narration: "Narration line for this scene.",
        visual_summary: "Simple cinematic description of what the viewer sees.",
        emotional_purpose: "What the viewer should feel in this scene.",
        visual_goal: "What this scene must clearly communicate visually.",
        editor_text_overlay_suggestion: "Optional short text added in editing only.",
        sound_design_notes: "Suggested sound or ambience for manual editing.",
        transition_notes: "How this scene should cut or transition.",
        continuity_notes: "What should remain consistent with other scenes.",
        kling_risk_notes: "Visual risks to avoid later when creating prompts.",
        source_idea_scene_reference: "Which original idea scene this came from.",
      },
      {
        scene_number: 5,
        duration_sec: 8,
        scene_role: "Twist / Emotional Reveal",
        slug: "short-scene-slug",
        narration: "Narration line for this scene.",
        visual_summary: "Simple cinematic description of what the viewer sees.",
        emotional_purpose: "What the viewer should feel in this scene.",
        visual_goal: "What this scene must clearly communicate visually.",
        editor_text_overlay_suggestion: "Optional short text added in editing only.",
        sound_design_notes: "Suggested sound or ambience for manual editing.",
        transition_notes: "How this scene should cut or transition.",
        continuity_notes: "What should remain consistent with other scenes.",
        kling_risk_notes: "Visual risks to avoid later when creating prompts.",
        source_idea_scene_reference: "Which original idea scene this came from.",
      },
    ],
    closing_payoff: "Final emotional meaning or twist explanation.",
    target_comment_hook: selectedIdea.target_comment_hook,
    platform_caption: "Short caption for TikTok, Shorts, and Reels.",
    hashtags: ["#FutureFiles", "#FutureTech", "#AIVideo"],
    estimated_duration_seconds: 42,
    total_duration_sec: 42,
    production_notes: {
      face_policy: "Use silhouettes, backs, reflections, or blurred profiles only.",
      editing_style: "Slow cinematic pacing, soft cuts, minimal text overlays.",
      recommended_test_scene: 1,
      why_test_this_scene_first: "Explain which scene should be tested first and why.",
      main_generation_risks: ["Risk 1", "Risk 2", "Risk 3"],
    },
    next_step: {
      recommended_action:
        "Review the script, then extract voiceover and build subject design.",
      needs_human_review: true,
      review_questions: [
        "Is the hook strong enough?",
        "Does the twist feel emotional instead of confusing?",
        "Can each scene be visualized clearly with AI video?",
      ],
    },
  };

  return `You are a world-class cinematic short-form video scriptwriter for faceless AI-generated videos.

You specialize in:
- 30-60 second TikTok / YouTube Shorts / Instagram Reels scripts
- cinematic speculative fiction
- future technology mini-stories
- emotional storytelling
- calm documentary-style voiceover
- Kling AI / Runway-friendly scene planning
- Western audiences: US, UK, Canada, Australia
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

CTA style:
${project.cta_style || "None provided"}

Face policy:
${project.face_policy || "None provided"}

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
Exactly ${project.scene_count} scenes

Content pillars:
${JSON.stringify(project.content_pillars, null, 2)}

Blocked topics:
${JSON.stringify(project.blocked_topics, null, 2)}

Negative visual rules:
${JSON.stringify(project.negative_visual_rules, null, 2)}

SELECTED IDEA FOCUS

Idea title:
${selectedIdea.title}

Pillar:
${selectedIdea.pillar}

Hook:
${selectedIdea.hook}

Concept:
${selectedIdea.concept}

Emotional triggers:
${JSON.stringify(selectedIdea.emotional_triggers, null, 2)}

Virality mechanics:
${JSON.stringify(selectedIdea.virality_mechanics, null, 2)}

Voiceover concept:
${selectedIdea.voiceover_concept}

Why it could go viral:
${selectedIdea.why_it_goes_viral}

Target comment hook:
${selectedIdea.target_comment_hook}

Kling difficulty:
${selectedIdea.kling_difficulty}

Success likelihood:
${selectedIdea.success_likelihood}

Production budget:
${selectedIdea.production_budget}

Expected comments:
${JSON.stringify(selectedIdea.expected_comments, null, 2)}

Original scene breakdown:
${JSON.stringify(selectedIdea.scene_breakdown, null, 2)}

Best time to post:
${selectedIdea.best_time_to_post}

Secondary platforms:
${JSON.stringify(selectedIdea.secondary_platforms, null, 2)}

FULL SELECTED IDEA JSON

Use this selected idea as the only creative source of truth.

Do not invent a new concept.
Do not change the core twist.
Do not change the emotional trigger.
Do not change the main visual direction.
You may improve wording for clarity, emotion, retention, and narration flow.

${selectedIdeaJson}

TASK

Generate a production-ready script package for this selected idea.

This output will be used by later Viral Forge tabs:
- Voiceover
- Subject Design
- Reference Image Prompts
- Scene Board
- Keyframe Prompts
- Kling Prompts
- Test Scene Review
- Export

You are not generating Kling prompts yet.
You are not generating image prompts yet.
You are not generating voice audio yet.

You are generating the script foundation that later steps will use.

SCRIPT REQUIREMENTS

The script must:
- Open with the selected idea hook or a stronger version of it.
- Make the first sentence instantly understandable.
- Create curiosity within the first 2 seconds.
- Build emotional tension scene by scene.
- Use short, cinematic narration.
- Avoid over-explaining the technology.
- Avoid technical jargon.
- Feel like a miniature future documentary.
- End with a twist, haunting line, or unresolved emotional question.
- Include a soft CTA only if it feels natural.
- Stay faithful to the selected idea.
- Preserve the idea's target comment hook.
- Preserve the emotional triggers.
- Preserve the main twist or ambiguity.
- Use the selected idea's scene breakdown as the base scene structure.

VOICEOVER REQUIREMENTS

The voiceover must be:
- clean narration only
- no scene labels
- no camera directions
- no character dialogue
- no bracket notes
- easy to record
- calm, poetic, mysterious, and concise

The voiceover should feel like:
A quiet future documentary about something beautiful and unsettling.

SCENE REQUIREMENTS

Create exactly ${sceneCount} scenes.

Total duration must be between 35 and 45 seconds.

Each scene must include:
- scene_number
- duration_sec
- scene_role
- slug
- narration
- visual_summary
- emotional_purpose
- visual_goal
- editor_text_overlay_suggestion
- sound_design_notes
- transition_notes
- continuity_notes
- kling_risk_notes
- source_idea_scene_reference

Scene role options:
- Hook
- Setup
- Build
- Tension
- Twist / Emotional Reveal

Duration rules:
- Scene 1: 5-7 seconds
- Middle scenes: 6-8 seconds each
- Final scene: 7-9 seconds
- total_duration_sec must equal the sum of scene durations

ON-SCREEN TEXT RULE

Do not require readable text inside Kling-generated video.

If text is useful, include it only as:
editor_text_overlay_suggestion

This means text added later by the human editor in CapCut, Premiere, or DaVinci.

RETENTION RULES

The script should include:
- a strong hook
- a clear emotional setup
- escalating curiosity
- one visual question viewers want answered
- one final ambiguity that sparks comments
- no wasted exposition

SAFETY RULES

Avoid:
- celebrities
- politics
- daily news
- copyrighted characters
- real brands or logos
- medical advice
- financial advice
- kid-focused content
- tutorials
- screen recordings
- fear-mongering
- fake scientific certainty
- gore
- explicit violence
- readable text required inside generated video
- complex hand interactions
- lip-sync dependency
- detailed facial acting

Use speculative framing:
- could
- may
- might
- imagine
- what if
- in one possible future

Avoid:
- this will happen
- scientists confirmed
- guaranteed
- everyone will
- breaking news
- proven

OUTPUT FORMAT

Return VALID JSON ONLY.
No markdown.
No explanation.
No preamble.
No trailing commas.
Do not wrap JSON in code fences.

STRICT OUTPUT RULES

- Output must be valid JSON.
- Use double quotes for all keys and strings.
- The JSON schema below is the exact shape to return, and the scenes array must contain 5 complete scene objects, not one example object.
- "scenes" must contain exactly ${sceneCount} scenes.
- "total_duration_sec" must equal the sum of all scene durations.
- "estimated_duration_seconds" must equal "total_duration_sec".
- "total_duration_sec" must be between 35 and 45.
- "idea_id" must match the selected idea id.
- "source_idea_title" must match the selected idea title.
- "full_voiceover" must be clean narration only.
- "full_voiceover" must not contain scene numbers.
- "full_voiceover" must not contain camera directions.
- No scene should require readable text inside generated video.
- No scene should require lip sync.
- No scene should require precise hand motion.
- No scene should depend on detailed facial acting.
- Do not include brands, logos, celebrities, politics, or copyrighted references.

JSON SCHEMA TO FOLLOW

${JSON.stringify(schemaExample, null, 2)}

FINAL QUALITY CHECK BEFORE RESPONDING

Before returning JSON, silently verify:
- The output is valid JSON.
- There are exactly ${sceneCount} scenes.
- total_duration_sec equals the sum of scene durations.
- estimated_duration_seconds equals total_duration_sec.
- The full_voiceover is narration only.
- The script stays faithful to the selected idea.
- The selected idea's hook, emotional triggers, and target comment hook are preserved.
- No scene requires readable text inside Kling.
- No scene requires lip sync.
- No scene requires precise hand interaction.
- No scene depends on detailed facial acting.
- The ending creates a comment impulse.
- The tone matches Future Files.
- The output contains JSON only.`;
}
