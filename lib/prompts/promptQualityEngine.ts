export const imagePromptQualityEngine = `IMAGE PROMPT QUALITY ENGINE

Optimize every image prompt for high-control still-image generation:
- Make each prompt self-contained; do not rely on previous context.
- Include subject identity, exact visual traits, materials, wardrobe or surface design, environment, composition, camera/lens feel, lighting, mood, color palette, aspect ratio, and quality target.
- Use concrete visible nouns and constraints instead of vague taste words.
- Preserve reusable identity anchors from subject design and Reference Image Prompts.
- Keep the composition generator-friendly: one clear focal subject, readable silhouette, stable lighting, no clutter, no tiny critical details.
- Avoid contradictions, brand names, celebrity likenesses, copyrighted designs, logos, readable text, UI screens, and impossible anatomy.
- Negative prompts must block low-quality output, extra limbs/fingers, warped faces, logos, text artifacts, inconsistent identity, cheap CGI, oversaturation, and style drift.
- Prefer practical cinematic language: full-body reference, close-up reference, clean environment plate, prop reference, or style reference.`;

export const videoPromptQualityEngine = `VIDEO PROMPT QUALITY ENGINE

Optimize every video prompt for controllable Kling-style generation:
- Describe a single scene with one primary action and one emotional beat.
- Include starting frame, ending frame, subject identity, subject motion, camera movement, environment, lighting, mood, duration, and aspect ratio.
- Keep motion physically simple: slow push-in, locked-off frame, gentle pan, subtle subject movement, clear foreground/background separation.
- Make continuity references explicit using subject, environment, prop, reference image, and keyframe IDs when available.
- Avoid too many simultaneous actions, complex hand interaction, lip-sync dependency, fast chaotic motion, readable text, screens with UI, logos, brands, celebrity likenesses, copyrighted designs, and scene changes inside one prompt.
- Negative prompts must block flicker, morphing, identity drift, extra limbs/fingers, unstable camera, warped objects, text artifacts, logos, jump cuts, oversaturated neon, low-resolution CGI, and inconsistent lighting.
- The prompt should be copyable into a video generator without additional explanation.`;
