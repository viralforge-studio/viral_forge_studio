import { type ZodError } from "zod";

export function formatZodIssues(error: ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.length ? issue.path.join(".") : "root",
    message: issue.message,
  }));
}

export function formatZodIssuesWithHints(error: ZodError, payload: unknown) {
  return error.issues.map((issue) => {
    const path = issue.path.length ? issue.path.join(".") : "root";
    const message = getFriendlyValidationMessage(issue.path, issue.message, payload);

    return { path, message };
  });
}

function getFriendlyValidationMessage(
  path: PropertyKey[],
  fallbackMessage: string,
  payload: unknown,
) {
  const rawValue = readPath(payload, path);

  if (
    path[path.length - 1] === "why_it_goes_viral" &&
    rawValue === undefined &&
    hasSiblingTypo(payload, path, "why_it_go_viral")
  ) {
    return "Missing `why_it_goes_viral`. Found `why_it_go_viral` instead.";
  }

  return fallbackMessage;
}

function readPath(source: unknown, path: PropertyKey[]) {
  let current = source;

  for (const segment of path) {
    if (current === null || current === undefined) {
      return undefined;
    }

    if (typeof segment === "number" && Array.isArray(current)) {
      current = current[segment];
      continue;
    }

    if (typeof current === "object" && segment in current) {
      current = (current as Record<PropertyKey, unknown>)[segment];
      continue;
    }

    return undefined;
  }

  return current;
}

function hasSiblingTypo(
  source: unknown,
  path: PropertyKey[],
  typoKey: string,
) {
  const parent = readPath(source, path.slice(0, -1));
  return Boolean(parent && typeof parent === "object" && typoKey in parent);
}
