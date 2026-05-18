export const nicheOptions = [
  {
    value: "Future Tech Mini Stories",
    label: "Future Tech Mini Stories",
    description: "Cinematic near-future AI, robotics, smart cities, and speculative tech shorts.",
  },
  {
    value: "AI Tools & Automation",
    label: "AI Tools & Automation",
    description: "Useful AI workflows, tools, agents, automation systems, and productivity ideas.",
  },
  {
    value: "Robots & AI Society",
    label: "Robots & AI Society",
    description: "Emotional, ethical, and social stories about robots living around humans.",
  },
  {
    value: "Luxury Future Living",
    label: "Luxury Future Living",
    description: "Premium future homes, transport, space living, and high-end speculative design.",
  },
  {
    value: "Space & Cosmic Mysteries",
    label: "Space & Cosmic Mysteries",
    description: "Space exploration, strange signals, alien worlds, and cosmic story hooks.",
  },
  {
    value: "Science Explainers",
    label: "Science Explainers",
    description: "Clear visual explanations of science, inventions, physics, and discoveries.",
  },
  {
    value: "Cybersecurity & Digital Risk",
    label: "Cybersecurity & Digital Risk",
    description: "Hacks, scams, privacy, digital identity, and online safety stories.",
  },
  {
    value: "Finance & Business Stories",
    label: "Finance & Business Stories",
    description: "Founder stories, business lessons, market psychology, and money narratives.",
  },
  {
    value: "Health & Longevity",
    label: "Health & Longevity",
    description: "Wellness, longevity, biohacking, and future medicine without medical advice.",
  },
  {
    value: "Fitness Motivation",
    label: "Fitness Motivation",
    description: "Training, discipline, transformation, habit-building, and athletic identity.",
  },
  {
    value: "History Reimagined",
    label: "History Reimagined",
    description: "Historical moments, alternate perspectives, artifacts, and dramatic reenactments.",
  },
  {
    value: "Mystery & Psychological Shorts",
    label: "Mystery & Psychological Shorts",
    description: "Suspense, eerie reveals, moral twists, and comment-driving ambiguity.",
  },
  {
    value: "Horror & Dark Fantasy",
    label: "Horror & Dark Fantasy",
    description: "Atmospheric supernatural stories, dark worlds, monsters, and unsettling reveals.",
  },
  {
    value: "Fantasy Worldbuilding",
    label: "Fantasy Worldbuilding",
    description: "Original kingdoms, magic systems, creatures, artifacts, and mythic scenes.",
  },
  {
    value: "Travel & Hidden Places",
    label: "Travel & Hidden Places",
    description: "Beautiful locations, unusual destinations, culture, and cinematic travel hooks.",
  },
  {
    value: "Food & Culinary Stories",
    label: "Food & Culinary Stories",
    description: "Recipes, kitchens, street food, restaurant stories, and satisfying food visuals.",
  },
  {
    value: "Fashion & Beauty",
    label: "Fashion & Beauty",
    description: "Outfits, styling, skincare, beauty transformations, and editorial visuals.",
  },
  {
    value: "Interior Design & Architecture",
    label: "Interior Design & Architecture",
    description: "Rooms, homes, materials, lighting, architecture, and aspirational spaces.",
  },
  {
    value: "Cars & Mobility",
    label: "Cars & Mobility",
    description: "Vehicles, future transport, motorsport energy, and cinematic machine design.",
  },
  {
    value: "Gaming & Virtual Worlds",
    label: "Gaming & Virtual Worlds",
    description: "Game-like worlds, character concepts, virtual spaces, and interactive culture.",
  },
  {
    value: "Education & Study",
    label: "Education & Study",
    description: "Learning systems, study motivation, knowledge breakdowns, and student content.",
  },
  {
    value: "Parenting & Family Life",
    label: "Parenting & Family Life",
    description: "Family moments, routines, emotional stories, and useful everyday scenarios.",
  },
  {
    value: "Pets & Animal Stories",
    label: "Pets & Animal Stories",
    description: "Pet-centered stories, animal care, emotional moments, and playful visual hooks.",
  },
  {
    value: "Spirituality & Mindset",
    label: "Spirituality & Mindset",
    description: "Reflection, discipline, calm, personal growth, and meaning-focused shorts.",
  },
] as const;

export type NicheOption = (typeof nicheOptions)[number];
