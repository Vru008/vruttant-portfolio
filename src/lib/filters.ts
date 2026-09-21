import type { Project } from "./data";

export const FILTERS = ["All", "React", "TypeScript", "Node.js", "MongoDB", "AI"] as const;
export type Filter = (typeof FILTERS)[number];

export function matchesFilter(p: Project, f: Filter) {
  if (f === "All") return true;
  if (f === "AI") return p.stack.some((s) => /gemini|claude|openai/i.test(s));
  return p.stack.some((s) => s === f || s.startsWith(f));
}
