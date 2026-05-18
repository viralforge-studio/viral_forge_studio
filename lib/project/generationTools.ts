export const videoToolOptions = [
  {
    value: "Kling",
    label: "Kling",
    description: "Strong default for cinematic image-to-video generation and controlled motion.",
  },
  {
    value: "Runway",
    label: "Runway",
    description: "Useful for polished generative video, editorial motion, and creative iteration.",
  },
  {
    value: "Pika",
    label: "Pika",
    description: "Good for fast short-form video experiments and stylized motion ideas.",
  },
  {
    value: "Luma Dream Machine",
    label: "Luma Dream Machine",
    description: "Useful for cinematic motion, atmosphere, and realistic camera movement.",
  },
  {
    value: "Haiper",
    label: "Haiper",
    description: "Useful for quick video drafts and social-first experiments.",
  },
  {
    value: "Manual / user-selected",
    label: "Manual / user-selected",
    description: "Leave the final video tool open and choose manually during production.",
  },
] as const;

export const imageToolOptions = [
  {
    value: "Manual / user-selected",
    label: "Manual / user-selected",
    description: "Keep the image generator flexible and choose manually for each project.",
  },
  {
    value: "Midjourney",
    label: "Midjourney",
    description: "Strong for premium cinematic style frames, references, and art direction.",
  },
  {
    value: "DALL-E",
    label: "DALL-E",
    description: "Useful for prompt-faithful images, clean concepts, and rapid visual drafts.",
  },
  {
    value: "Stable Diffusion",
    label: "Stable Diffusion",
    description: "Best when you want local control, LoRAs, ControlNet, or custom workflows.",
  },
  {
    value: "Flux",
    label: "Flux",
    description: "Strong for high-quality realistic and stylized image generation.",
  },
  {
    value: "Leonardo",
    label: "Leonardo",
    description: "Useful for production-friendly concept art and game-style visual assets.",
  },
  {
    value: "Ideogram",
    label: "Ideogram",
    description: "Useful when typography-oriented image concepts are needed, though prompts still avoid readable text by default.",
  },
] as const;

export const videoFormatOptions = [
  {
    value: "Vertical 9:16 short-form video",
    label: "Vertical 9:16 short-form video",
    description: "Best for TikTok, YouTube Shorts, Instagram Reels, and mobile-first AI video.",
  },
  {
    value: "Square 1:1 social video",
    label: "Square 1:1 social video",
    description: "Useful for feed posts, social ads, and balanced multi-platform layouts.",
  },
  {
    value: "Landscape 16:9 cinematic video",
    label: "Landscape 16:9 cinematic video",
    description: "Best for YouTube, widescreen storytelling, trailers, and cinematic exports.",
  },
  {
    value: "Portrait 4:5 social video",
    label: "Portrait 4:5 social video",
    description: "Useful for Instagram feed, LinkedIn, and vertical formats with more headroom.",
  },
  {
    value: "Ultrawide 21:9 cinematic video",
    label: "Ultrawide 21:9 cinematic video",
    description: "Useful for premium cinematic concepts and horizontal hero scenes.",
  },
  {
    value: "Manual / user-selected",
    label: "Manual / user-selected",
    description: "Choose the exact format later during production.",
  },
] as const;
