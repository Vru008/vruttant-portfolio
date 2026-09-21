import { complete, findProject, runCommand } from "./commands";
import { projects } from "./data";
import type { GitHubStats } from "./github";

const stats: GitHubStats = {
  user: "Vru008", generatedAt: "2026-09-21T00:00:00+00:00", repoCount: 3, totalStars: 0, repos: [],
  languages: [{ name: "JavaScript", bytes: 900, percent: 90 }, { name: "CSS", bytes: 100, percent: 10 }],
};
const text = (raw: string, s: GitHubStats | null = stats) => runCommand(raw, { stats: s }).lines.map((l) => l.text).join("\n");

describe("runCommand", () => {
  it("lists every project", () => {
    const out = text("projects");
    projects.forEach((p) => expect(out).toContain(p.name));
  });

  it("opens a project by number or name, preferring the live demo", () => {
    const jobmate = projects[0]!;
    expect(runCommand("open 1", { stats }).effect).toEqual({ type: "open", url: jobmate.live });
    expect(runCommand("open JOBMATE", { stats }).effect).toEqual({ type: "open", url: jobmate.live });
  });

  it("scrolls to the card when a project has no public link", () => {
    const priv = projects.find((p) => !p.live && !p.repo)!;
    expect(runCommand(`open ${priv.id}`, { stats }).effect).toEqual({ type: "scroll", target: `project-${priv.id}` });
  });

  it("reports unknown commands and bad arguments as errors", () => {
    expect(runCommand("rm -rf /", { stats }).lines[0]?.kind).toBe("error");
    expect(runCommand("open 99", { stats }).lines[0]?.kind).toBe("error");
    expect(runCommand("open", { stats }).lines[0]?.kind).toBe("error");
  });

  it("renders live GitHub stats, or a loading notice without them", () => {
    expect(text("github")).toMatch(/JavaScript\s+■+ 90%/);
    expect(text("github", null)).toMatch(/loading/);
  });

  it("is case- and whitespace-insensitive and has aliases", () => {
    expect(text("  HELP  ")).toContain("Available commands");
    expect(text("ls")).toBe(text("projects"));
    expect(runCommand("cls", { stats }).effect).toEqual({ type: "clear" });
  });

  it("describes the AI toolkit", () => {
    const out = text("ai");
    ["Claude", "ChatGPT", "Gemini"].forEach((t) => expect(out).toContain(t));
  });

  it("has an easter egg", () => {
    expect(text("sudo hire-me")).toContain("Permission granted");
    expect(text("sudo rm")).toContain("Nice try");
  });
});

describe("findProject / complete", () => {
  it("resolves numbers within range only", () => {
    expect(findProject("2")?.id).toBe(projects[1]!.id);
    expect(findProject("0")).toBeUndefined();
  });

  it("autocompletes unique commands and project names", () => {
    expect(complete("proj")).toBe("projects");
    expect(complete("open health")).toBe("open healthkeeper");
    expect(complete("e")).toBeNull(); // ambiguous: experience / education
  });
});
