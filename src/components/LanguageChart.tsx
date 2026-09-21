import { motion } from "motion/react";
import type { StatsState } from "../hooks/useGitHubStats";
import { useCountUp } from "../hooks/useCountUp";
import { LANG_COLORS, type GitHubStats } from "../lib/github";
import { BrandIcon } from "./BrandIcon";

/** GitHub files .jsx under "JavaScript", so this card shows the React side from real package.json + file scans. */
function ReactFootprint({ stats }: { stats: GitHubStats }) {
  const react = stats.react;
  const components = useCountUp(react?.componentFiles ?? 0);
  if (!react || react.repos.length === 0) return null;

  return (
    <div className="react-card card">
      <div className="react-card-head">
        <span className="react-spin"><BrandIcon name="react" size={34} /></span>
        <div>
          <h3>React footprint</h3>
          <p className="muted small">Scanned from my public repos</p>
        </div>
      </div>
      <div className="react-numbers">
        <div><strong>{components}</strong><span>React component files</span></div>
        <div><strong>{react.repos.length}/{stats.repoCount}</strong><span>repos built on React</span></div>
      </div>
      {stats.frameworks && (
        <ul className="fw-list">
          {stats.frameworks.map((f, i) => (
            <li key={f.name}>
              <span className="fw-name">{f.name}</span>
              <span className="fw-bar">
                <motion.i initial={{ width: 0 }} whileInView={{ width: `${(f.repos.length / stats.repoCount) * 100}%` }}
                          viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.07, ease: "easeOut" }} />
              </span>
              <span className="fw-count">{f.repos.length} {f.repos.length === 1 ? "repo" : "repos"}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function LanguageChart({ state }: { state: StatsState }) {
  if (state.status === "loading") return <div className="lang-card card skeleton" aria-busy="true" />;
  if (state.status === "error" || state.stats.languages.length === 0) {
    return <div className="lang-card card"><p className="muted">Live GitHub stats are unavailable right now.</p></div>;
  }

  const { stats } = state;
  const kb = Math.round(stats.languages.reduce((a, l) => a + l.bytes, 0) / 1024);

  return (
    <div className="stats-stack">
      <ReactFootprint stats={stats} />
      <div className="lang-card card">
        <div className="lang-head">
          <h3>Languages on my GitHub</h3>
          <span className="live-pill"><span className="pulse" aria-hidden="true" /> live</span>
        </div>
        <div className="lang-bar" role="img" aria-label={stats.languages.map((l) => `${l.name} ${l.percent}%`).join(", ")}>
          {stats.languages.map((l, i) => (
            <motion.span key={l.name} title={`${l.name} ${l.percent}%`}
                         style={{ flexGrow: Math.max(l.percent, 0.8), background: LANG_COLORS[l.name] ?? "#8b949e", transformOrigin: "left" }}
                         initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                         transition={{ duration: 0.7, delay: i * 0.12, ease: "easeOut" }} />
          ))}
        </div>
        <ul className="lang-legend">
          {stats.languages.map((l) => (
            <li key={l.name}>
              <i style={{ background: LANG_COLORS[l.name] ?? "#8b949e" }} />
              <b>{l.name}</b> {l.percent}%
            </li>
          ))}
        </ul>
        <p className="muted small">
          {kb.toLocaleString()} KB across {stats.repoCount} public repos · refreshed {stats.generatedAt.slice(0, 10)} by a daily GitHub Actions job
        </p>
      </div>
    </div>
  );
}
