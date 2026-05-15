import { type Idea } from "@/lib/schemas/ideas";
import { type Project } from "@/lib/schemas/project";
import { type ScriptGeneration } from "@/lib/schemas/script";
import { type SubjectDesign } from "@/lib/schemas/subject-design";

export async function generateSubjectDesignWithMock(
  project: Project,
  selectedIdea: Idea,
  scriptGeneration: ScriptGeneration,
  prompt: string,
): Promise<SubjectDesign> {
  void prompt;
  return {
    generation_timestamp: new Date().toISOString(),
    project_id: project.id,
    channel: project.channel_name,
    idea_id: selectedIdea.id,
    source_idea_title: selectedIdea.title,
    source_script_title: scriptGeneration.title,
    visual_style_summary:
      `${project.visual_style}. The visual identity should feel premium, restrained, realistic, and emotionally haunted rather than flashy.`,
    design_goal:
      "Define reusable visual identities for the main subjects, environments, and story props so future image and Kling stages can stay consistent.",
    main_subjects: [
      {
        id: "subject_robot_01",
        name: "Domestic companion robot",
        type: "robot",
        role_in_story: "Primary emotional subject whose stillness and wear carry the story.",
        description:
          "A tall domestic companion robot with understated utility design, soft sensor glow, lightly worn casing, and premium near-future proportions.",
        silhouette:
          "Recognizable upright silhouette with rounded shoulders, slim torso, calm head shape, and one soft optical glow point.",
        materials: ["matte ceramic composite", "brushed titanium", "smoked glass sensors"],
        colors: ["weathered pearl white", "soft graphite", "muted cyan glow"],
        lighting_interaction:
          "Low blue ambient light should glide across the shell while warm hallway light reveals scuffs and edge wear.",
        age_or_condition: "aged",
        emotion_to_convey: "loyalty, patience, and unresolved loneliness",
        face_policy:
          "Do not rely on expressive facial features. Emotion should come from posture, framing, and sensor brightness.",
        consistency_rules: [
          "Keep the sensor glow understated and consistent across scenes.",
          "Maintain the same worn panel lines and shoulder silhouette.",
          "Avoid transforming the robot into a combat or toy-like design.",
        ],
        avoid: [
          "Avoid resemblance to famous movie robots.",
          "Avoid logos or readable interface markings.",
        ],
      },
      {
        id: "subject_figure_01",
        name: "Mystery silhouette",
        type: "human",
        role_in_story: "Secondary unknown figure used only for final ambiguity.",
        description:
          "A distant human silhouette with minimal readable features, seen mostly through doorway light or reflection.",
        silhouette:
          "Tall narrow silhouette with clean outer shape and no detailed face visibility.",
        materials: ["dark fabric coat", "rain-slick surface highlights"],
        colors: ["charcoal", "wet black", "dim gold rim light"],
        lighting_interaction:
          "Should read mostly as shape and contrast against hallway or exterior light.",
        age_or_condition: "unknown",
        emotion_to_convey: "uncertainty and emotional gravity",
        face_policy:
          "Keep the face hidden, blurred, backlit, reflected, or turned away.",
        consistency_rules: [
          "Do not reveal specific facial identity.",
          "Use the figure sparingly and only as a final ambiguity beat.",
          "Preserve distance and mystery rather than detail.",
        ],
        avoid: [
          "Avoid celebrity likeness.",
          "Avoid lip-sync or close face acting dependence.",
        ],
      },
    ],
    environments: [
      {
        id: "env_apartment_01",
        name: "Abandoned futuristic apartment",
        role_in_story: "Primary location where the emotional waiting unfolds.",
        description:
          "A premium near-future apartment with restrained technology, soft smart-lighting infrastructure, subtle decay, and elegant emptiness.",
        architecture_style: "minimalist premium sci-fi residential",
        materials: ["smart glass", "concrete composite", "brushed metal", "soft-touch polymer"],
        color_palette: ["deep slate blue", "muted steel", "warm amber practical light"],
        lighting: "Soft low-key interior lighting with controlled cyan and warm gold contrast.",
        mood: "beautiful, still, lonely, and quietly unsettling",
        continuity_rules: [
          "Preserve the same floor plan language and material palette across scenes.",
          "Keep the apartment premium and believable, not cluttered or dystopian.",
        ],
        avoid: ["No logos.", "No readable text."],
      },
      {
        id: "env_hallway_01",
        name: "Apartment hallway threshold",
        role_in_story: "Important transition space for anticipation and reveal.",
        description:
          "A quiet polished hallway with controlled overhead strips and a soft spill of door light.",
        architecture_style: "clean future residential corridor",
        materials: ["dark wall panels", "matte floor surface", "integrated light strips"],
        color_palette: ["midnight blue", "graphite", "pale gold"],
        lighting: "Thin directional light with strong negative space and gentle reflections.",
        mood: "suspended, tense, watchful",
        continuity_rules: [
          "Keep the hallway simple and elegant so the door and silhouette remain focal.",
          "Preserve the same light direction in reveal shots.",
        ],
        avoid: ["No logos.", "No readable text."],
      },
    ],
    props: [
      {
        id: "prop_door_01",
        name: "Apartment door",
        role_in_story: "Main trigger object for waiting, anticipation, and reveal.",
        description:
          "A seamless future apartment door with subtle perimeter light and a premium understated locking mechanism.",
        visual_rules: [
          "Keep the light behavior consistent scene to scene.",
          "Do not add readable numbers or labels.",
        ],
        avoid: ["No readable labels."],
      },
      {
        id: "prop_hallway_light_01",
        name: "Hallway light strip",
        role_in_story: "Important atmospheric cue for doorway activation and suspense.",
        description:
          "A narrow integrated light strip that softly intensifies when the corridor becomes active.",
        visual_rules: [
          "Use as a mood accent, not a flashy sci-fi effect.",
          "Keep the tone soft and believable.",
        ],
        avoid: ["No alarm-style red flashing.", "No readable UI."],
      },
    ],
    scene_design_map: [
      {
        scene_number: 1,
        scene_role: "Hook",
        required_subjects: ["subject_robot_01"],
        required_environments: ["env_apartment_01"],
        required_props: ["prop_door_01"],
        design_focus: "Establish the robot silhouette and the premium loneliness of the apartment immediately.",
        continuity_notes: "The robot sensor glow, apartment materials, and quiet mood must start consistent here.",
      },
      {
        scene_number: 2,
        scene_role: "Setup",
        required_subjects: ["subject_robot_01"],
        required_environments: ["env_apartment_01"],
        required_props: ["prop_door_01"],
        design_focus: "Show environmental decay and time passing without losing the core robot silhouette.",
        continuity_notes: "Keep all wear believable and cumulative rather than chaotic.",
      },
      {
        scene_number: 3,
        scene_role: "Build",
        required_subjects: ["subject_robot_01"],
        required_environments: ["env_apartment_01"],
        required_props: [],
        design_focus: "Bring attention to the robot face policy and emotional stillness through framing and light.",
        continuity_notes: "Do not shift the robot into expressive face acting.",
      },
      {
        scene_number: 4,
        scene_role: "Tension",
        required_subjects: ["subject_robot_01"],
        required_environments: ["env_hallway_01", "env_apartment_01"],
        required_props: ["prop_door_01", "prop_hallway_light_01"],
        design_focus: "The activated hallway and door light must heighten suspense without becoming noisy.",
        continuity_notes: "Preserve apartment-to-hallway color continuity and the same architectural language.",
      },
      {
        scene_number: 5,
        scene_role: "Twist / Emotional Reveal",
        required_subjects: ["subject_robot_01", "subject_figure_01"],
        required_environments: ["env_hallway_01", "env_apartment_01"],
        required_props: ["prop_door_01"],
        design_focus: "Keep the mystery figure minimal while preserving the robot as the emotional anchor.",
        continuity_notes: "The final silhouette should remain unreadable and never overpower the robot's identity.",
      },
    ],
    global_style_guide: {
      camera_language:
        "Slow cinematic push-ins, restrained wide frames, and emotionally charged negative space.",
      lighting_language:
        "Soft blue-black ambience balanced with selective warm gold practical light for emotional contrast.",
      texture_language:
        "Premium realistic materials, gentle wear, subtle dust, soft moisture reflections, and grounded future-tech surfaces.",
      mood_keywords: ["lonely", "premium", "quietly unsettling"],
      negative_style_rules: [
        "No neon cyberpunk.",
        "No cartoon look.",
        "No logos.",
        "No readable text.",
      ],
    },
    image_generation_readiness: {
      recommended_first_design_image: "subject_robot_01",
      why:
        "The robot is the emotional anchor and the clearest continuity risk, so locking its silhouette first will stabilize every later stage.",
      reference_image_prompt_seed:
        "A premium near-future domestic companion robot, aged but elegant, standing still inside a lonely cinematic apartment with soft cyan and gold lighting.",
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
}
