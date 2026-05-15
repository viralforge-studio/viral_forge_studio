const replacementRules: Array<[RegExp, string]> = [
  [/\bC-?3PO\b/gi, "famous gold humanoid robot"],
  [/\bR2-?D2\b/gi, "famous small dome-shaped robot"],
  [/\bBaymax\b/gi, "famous soft white medical robot"],
  [/\bChappie\b/gi, "famous gritty humanoid robot"],
  [/\bApple\b/gi, "premium minimalist consumer-tech aesthetic"],
  [/\bBlack Mirror\b/gi, "unsettling near-future anthology tone"],
];

function sanitizeString(text: string) {
  let sanitized = text;

  for (const [pattern, replacement] of replacementRules) {
    sanitized = sanitized.replace(pattern, replacement);
  }

  sanitized = sanitized.replace(
    /Avoid resemblance to any movie robot including [^.]+\.?/gi,
    "Avoid resemblance to famous movie robots, franchise androids, soft white mascot-like robots, or gritty industrial humanoid robots.",
  );

  sanitized = sanitized.replace(
    /Avoid resemblance to famous movie robots, franchise androids, soft white mascot-like robots, or gritty industrial humanoid robots\.[^.]*\./gi,
    "Avoid resemblance to famous movie robots, franchise androids, soft white mascot-like robots, or gritty industrial humanoid robots.",
  );

  return sanitized;
}

export function sanitizePromptContext<T>(input: T): T {
  if (typeof input === "string") {
    return sanitizeString(input) as T;
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizePromptContext(item)) as T;
  }

  if (input && typeof input === "object") {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [key, sanitizePromptContext(value)]),
    ) as T;
  }

  return input;
}
