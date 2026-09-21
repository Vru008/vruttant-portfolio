// Types + loader for public/data/github.json, which scripts/fetch_github.py regenerates daily in CI.

export interface LanguageStat { name: string; bytes: number; percent: number }

export interface RepoStat {
  name: string;
  url: string;
  homepage: string | null;
  description: string | null;
  stars: number;
  pushedAt: string | null;
  languages: string[];
}

export interface ReactFootprint { repos: string[]; componentFiles: number; hookFiles: number }
export interface FrameworkStat { name: string; repos: string[] }

export interface GitHubStats {
  user: string;
  generatedAt: string;
  repoCount: number;
  totalStars: number;
  languages: LanguageStat[];
  /** Optional so an older snapshot still renders. */
  react?: ReactFootprint;
  frameworks?: FrameworkStat[];
  repos: RepoStat[];
}

export async function loadStats(url = `${import.meta.env.BASE_URL}data/github.json`): Promise<GitHubStats | null> {
  try {
    const res = await fetch(url, { cache: "no-cache" });
    return res.ok ? ((await res.json()) as GitHubStats) : null;
  } catch {
    return null;
  }
}

// GitHub's own linguist colours, so the chart matches the profile page.
export const LANG_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  CSS: "#663399",
  HTML: "#e34c26",
  Python: "#3572A5",
};
