import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState, type CSSProperties } from "react";
import { projects, type Project } from "../lib/data";
import { FILTERS, matchesFilter, type Filter } from "../lib/filters";
import { TiltCard } from "./motion";

function ProjectCard({ p, index }: { p: Project; index: number }) {
  return (
    <motion.article
      layout
      id={`project-${p.id}`}
      className="project-cell"
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: (index % 2) * 0.08 }}
    >
      <TiltCard className="card project" max={4}>
        <div style={{ "--accent": p.accent } as CSSProperties} className="project-body">
          <div className="card-top">
            <span className="card-index">{String(index + 1).padStart(2, "0")}</span>
            <h3>{p.name}</h3>
            {p.live && <span className="live-dot" title="Deployed"><span className="pulse" aria-hidden="true" /> live</span>}
          </div>
          <p className="tagline">{p.tagline}</p>
          <p className="problem"><b>Problem:</b> {p.problem}</p>
          <ul className="highlights">
            {p.highlights.map((h) => <li key={h}>{h}</li>)}
          </ul>
          <ul className="chips" aria-label="Tech stack">
            {p.stack.map((s) => <li key={s} className={s.startsWith("React") ? "chip-react" : undefined}>{s}</li>)}
          </ul>
          <div className="card-links">
            {p.live && <a className="btn btn-primary" href={p.live} target="_blank" rel="noopener">Live demo ↗</a>}
            {p.repo && <a className="btn" href={p.repo} target="_blank" rel="noopener">Source code ↗</a>}
            {!p.live && !p.repo && p.status && <span className="status">{p.status}</span>}
            {p.liveNote && <span className="note">{p.liveNote}</span>}
          </div>
        </div>
      </TiltCard>
    </motion.article>
  );
}

export function Projects() {
  const [filter, setFilter] = useState<Filter>("All");
  const visible = useMemo(() => projects.filter((p) => matchesFilter(p, filter)), [filter]);

  return (
    <>
      <div className="filters" role="group" aria-label="Filter projects by technology">
        {FILTERS.map((f) => (
          <button key={f} className={`filter ${filter === f ? "on" : ""}`} aria-pressed={filter === f}
                  onClick={() => setFilter(f)}>
            {filter === f && <motion.span layoutId="filter-pill" className="filter-pill" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
            <span className="filter-label">{f}</span>
          </button>
        ))}
        <span className="filter-count" aria-live="polite">{visible.length} of {projects.length}</span>
      </div>
      <motion.div layout className="project-grid">
        <AnimatePresence mode="popLayout">
          {visible.map((p) => <ProjectCard key={p.id} p={p} index={projects.indexOf(p)} />)}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
