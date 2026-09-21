// Pure command interpreter behind the <Terminal /> component. No DOM access, so it is trivially testable.
import { aiTools, education, experience, profile, projects, skills } from "./data";
import type { GitHubStats } from "./github";

export type Line = { text: string; kind?: "muted" | "accent" | "error" | "link"; href?: string };

export interface Result {
  lines: Line[];
  effect?: { type: "clear" } | { type: "open"; url: string } | { type: "theme" } | { type: "scroll"; target: string };
}

export interface Context {
  stats: GitHubStats | null;
}

const COMMANDS: Record<string, string> = {
  help: "list commands",
  about: "who I am",
  projects: "things I've built",
  "open <n|name>": "open a project (live demo or repo)",
  skills: "tech I work with",
  experience: "where I've worked",
  education: "degrees",
  ai: "how I work with Claude, ChatGPT, Gemini",
  github: "live GitHub stats",
  contact: "how to reach me",
  resume: "download my résumé",
  theme: "toggle light / dark",
  clear: "clear the screen",
};

const pad = (s: string, n: number) => s + " ".repeat(Math.max(1, n - s.length));

export function findProject(arg: string) {
  const n = Number(arg);
  if (Number.isInteger(n) && n >= 1 && n <= projects.length) return projects[n - 1];
  const q = arg.toLowerCase();
  return projects.find((p) => p.id === q || p.name.toLowerCase().startsWith(q));
}

export function runCommand(raw: string, ctx: Context): Result {
  const [cmd = "", ...rest] = raw.trim().split(/\s+/);
  const arg = rest.join(" ");

  switch (cmd.toLowerCase()) {
    case "":
      return { lines: [] };

    case "help":
    case "?":
      return {
        lines: [
          { text: "Available commands:", kind: "accent" },
          ...Object.entries(COMMANDS).map(([c, d]) => ({ text: `  ${pad(c, 16)}${d}` })),
          { text: "Tip: ↑/↓ for history, Tab to autocomplete.", kind: "muted" },
        ],
      };

    case "about":
    case "whoami":
      return {
        lines: [
          { text: `${profile.name}: ${profile.role}`, kind: "accent" },
          { text: profile.summary },
        ],
      };

    case "projects":
    case "ls":
      return {
        lines: [
          ...projects.map((p, i) => ({ text: `  [${i + 1}] ${pad(p.name, 14)}${p.tagline}` })),
          { text: "Type `open 1` (or `open jobmate`) to launch one.", kind: "muted" },
        ],
      };

    case "open":
    case "cd": {
      if (!arg) return { lines: [{ text: "usage: open <number|name>", kind: "error" }] };
      const p = findProject(arg);
      if (!p) return { lines: [{ text: `no project matches "${arg}". Try \`projects\`.`, kind: "error" }] };
      const url = p.live ?? p.repo;
      if (!url) {
        return {
          lines: [{ text: `${p.name}: ${p.status ?? "not public yet"}. Jumping to its card.`, kind: "muted" }],
          effect: { type: "scroll", target: `project-${p.id}` },
        };
      }
      return { lines: [{ text: `Opening ${p.name} → ${url}`, kind: "link", href: url }], effect: { type: "open", url } };
    }

    case "skills":
    case "stack":
      return {
        lines: Object.entries(skills).map(([group, items]) => ({ text: `  ${pad(group, 14)}${items.join(" · ")}` })),
      };

    case "experience":
      return {
        lines: experience.flatMap((r) => [
          { text: `${r.title} @ ${r.company}  (${r.period})`, kind: "accent" as const },
          ...r.points.map((pt) => ({ text: `  • ${pt}` })),
        ]),
      };

    case "education":
      return { lines: education.map((e) => ({ text: `  ${e.degree}, ${e.school} (${e.period})` })) };

    case "ai":
      return {
        lines: aiTools.flatMap((t) => [
          { text: `${t.name}: ${t.role}`, kind: "accent" as const },
          ...t.points.map((pt) => ({ text: `  • ${pt}` })),
        ]),
      };

    case "github": {
      const s = ctx.stats;
      if (!s) return { lines: [{ text: "GitHub stats are still loading. Try again in a second.", kind: "muted" }] };
      return {
        lines: [
          { text: `@${s.user}: ${s.repoCount} public repos · generated ${s.generatedAt.slice(0, 10)}`, kind: "accent" },
          ...(s.react ? [{ text: `  React       ${s.react.componentFiles} component files in ${s.react.repos.join(", ")}`, kind: "accent" as const }] : []),
          ...s.languages.map((l) => ({ text: `  ${pad(l.name, 12)}${"■".repeat(Math.max(1, Math.round(l.percent / 4)))} ${l.percent}%` })),
          { text: "Refreshed daily by a GitHub Actions job.", kind: "muted" },
        ],
      };
    }

    case "contact":
      return {
        lines: [
          { text: `  email   ${profile.email}`, kind: "link", href: `mailto:${profile.email}` },
          { text: `  github  ${profile.github}`, kind: "link", href: profile.github },
        ],
      };

    case "resume":
    case "cv":
      return { lines: [{ text: "Downloading résumé…", kind: "muted" }], effect: { type: "open", url: profile.resume } };

    case "theme":
      return { lines: [{ text: "Theme toggled.", kind: "muted" }], effect: { type: "theme" } };

    case "clear":
    case "cls":
      return { lines: [], effect: { type: "clear" } };

    case "sudo":
      return arg.toLowerCase().replace(/[\s-]/g, "") === "hireme"
        ? { lines: [{ text: "Permission granted ✔ Let's talk:", kind: "accent" }, { text: `  ${profile.email}`, kind: "link", href: `mailto:${profile.email}` }] }
        : { lines: [{ text: "Nice try. (hint: sudo hire-me)", kind: "error" }] };

    default:
      return { lines: [{ text: `command not found: ${cmd}. Type \`help\`.`, kind: "error" }] };
  }
}

const COMPLETIONS = [...Object.keys(COMMANDS).map((c) => c.split(" ")[0] ?? c), "sudo hire-me"];

export function complete(partial: string): string | null {
  const q = partial.trimStart().toLowerCase();
  if (!q) return null;
  if (q.startsWith("open ")) {
    const name = q.slice(5);
    const hit = projects.find((p) => p.id.startsWith(name));
    return hit ? `open ${hit.id}` : null;
  }
  const hits = COMPLETIONS.filter((c) => c.startsWith(q));
  return hits.length === 1 ? (hits[0] ?? null) : null;
}
