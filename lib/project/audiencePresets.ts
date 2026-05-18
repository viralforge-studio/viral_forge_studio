export const manualOptionValue = "__manual__";

export const positioningOptions = [
  {
    value: "Cinematic stories from tomorrow",
    label: "Cinematic stories from tomorrow",
    description: "Premium speculative storytelling with mystery, wonder, and future-facing emotion.",
  },
  {
    value: "Practical AI workflows for creators and operators",
    label: "Practical AI workflows",
    description: "Useful, tool-driven positioning for audiences who want repeatable AI systems.",
  },
  {
    value: "High-retention mystery shorts with a final twist",
    label: "Mystery shorts with twist",
    description: "Hook-first short stories designed around suspense, ambiguity, and comments.",
  },
  {
    value: "Premium educational explainers with cinematic visuals",
    label: "Premium explainers",
    description: "Clear learning content elevated with polished visual direction.",
  },
  {
    value: "Aspirational design and lifestyle stories for modern viewers",
    label: "Aspirational lifestyle",
    description: "Visually refined positioning for lifestyle, design, travel, and luxury niches.",
  },
  {
    value: manualOptionValue,
    label: "Manual / custom",
    description: "Write a custom positioning statement.",
  },
] as const;

export const audienceOptions = [
  {
    value:
      "US, UK, Canada, Australia, age 18-44, tech-curious, sci-fi fans, AI/robotics enthusiasts",
    label: "Future tech viewers",
    description: "The default Future Files audience for cinematic AI and robotics shorts.",
  },
  {
    value:
      "Global English-speaking creators, founders, operators, and professionals age 20-45 who want practical AI leverage",
    label: "AI creators and operators",
    description: "Best for AI tools, automation, productivity, and business workflow content.",
  },
  {
    value:
      "Mobile-first viewers age 18-34 who enjoy suspense, eerie reveals, psychological twists, and comment-worthy endings",
    label: "Mystery and suspense fans",
    description: "Best for dark, suspenseful, emotionally sticky short stories.",
  },
  {
    value:
      "Curious learners age 16-40 who like fast, clear explanations with strong visuals and memorable examples",
    label: "Curious learners",
    description: "Best for educational, science, history, and explainer content.",
  },
  {
    value:
      "Aspirational social viewers age 18-44 interested in design, travel, style, luxury, and visually polished ideas",
    label: "Aspirational lifestyle viewers",
    description: "Best for design, travel, fashion, beauty, luxury, and interiors.",
  },
  {
    value: manualOptionValue,
    label: "Manual / custom",
    description: "Write a custom audience profile.",
  },
] as const;

export const targetCountryOptions = [
  {
    value: "us_uk_ca_au",
    label: "US, UK, Canada, Australia",
    description: "High-value English-speaking audience set for short-form content.",
    countries: ["US", "UK", "Canada", "Australia"],
  },
  {
    value: "global_english",
    label: "Global English",
    description: "Broad English-speaking audience without country restriction.",
    countries: ["US", "UK", "Canada", "Australia", "India", "Singapore", "UAE"],
  },
  {
    value: "north_america",
    label: "North America",
    description: "Focused US and Canada targeting.",
    countries: ["US", "Canada"],
  },
  {
    value: "europe_english",
    label: "Europe English",
    description: "English-friendly European markets.",
    countries: ["UK", "Ireland", "Germany", "Netherlands", "Sweden"],
  },
  {
    value: "asia_growth",
    label: "Asia growth markets",
    description: "Useful for broad tech, lifestyle, and education growth content.",
    countries: ["India", "Singapore", "Malaysia", "Philippines", "UAE"],
  },
  {
    value: manualOptionValue,
    label: "Manual / custom",
    description: "Add custom countries manually.",
    countries: [],
  },
] as const;

export const languageOptions = [
  {
    value: "English",
    label: "English",
    description: "Default language for broad international short-form reach.",
  },
  {
    value: "Spanish",
    label: "Spanish",
    description: "Useful for Spain, Latin America, and US Spanish-speaking audiences.",
  },
  {
    value: "Hindi",
    label: "Hindi",
    description: "Useful for India-focused audience growth.",
  },
  {
    value: "Arabic",
    label: "Arabic",
    description: "Useful for Middle East and North Africa audiences.",
  },
  {
    value: "French",
    label: "French",
    description: "Useful for France, Canada, and French-speaking international markets.",
  },
  {
    value: manualOptionValue,
    label: "Manual / custom",
    description: "Enter a custom language or multilingual plan.",
  },
] as const;
