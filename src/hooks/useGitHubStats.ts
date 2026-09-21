import { useEffect, useState } from "react";
import { loadStats, type GitHubStats } from "../lib/github";

export type StatsState = { status: "loading" } | { status: "ready"; stats: GitHubStats } | { status: "error" };

/** Loaded once in <App /> and passed down, so the chart and the terminal share one request. */
export function useGitHubStats(): StatsState {
  const [state, setState] = useState<StatsState>({ status: "loading" });

  useEffect(() => {
    let alive = true;
    loadStats().then((stats) => {
      if (alive) setState(stats ? { status: "ready", stats } : { status: "error" });
    });
    return () => { alive = false; };
  }, []);

  return state;
}
