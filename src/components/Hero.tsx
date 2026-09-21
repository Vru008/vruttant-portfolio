import { motion } from "motion/react";
import { onResumeClick, RESUME_FILENAME } from "../lib/resume";
import { profile, projects } from "../lib/data";
import type { GitHubStats } from "../lib/github";
import { useCountUp } from "../hooks/useCountUp";
import { useTypewriter } from "../hooks/useTypewriter";
import { BrandIcon } from "./BrandIcon";
import { CodeWindow } from "./CodeWindow";
import { fadeUp, stagger } from "../lib/variants";
import { Magnetic } from "./motion";

function Stat({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
  const n = useCountUp(value);
  return (
    <motion.div className="stat" variants={fadeUp}>
      <strong>{n}{suffix}</strong>
      <span>{label}</span>
    </motion.div>
  );
}

function ReactAtom() {
  return (
    <svg className="atom" viewBox="-12 -12 24 24" aria-hidden="true">
      <circle r="2.05" fill="currentColor" />
      <g fill="none" stroke="currentColor" strokeWidth="0.9">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

const float = (delay: number) => ({
  animate: { y: [0, -10, 0] },
  transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const, delay },
});

export function Hero({ stats }: { stats: GitHubStats | null }) {
  const typed = useTypewriter(profile.rotating);
  const components = stats?.react?.componentFiles ?? 0;

  return (
    <section className="hero" id="top">
      <div className="aurora" aria-hidden="true"><span /><span /><span /></div>
      <div className="grid-bg" aria-hidden="true" />

      <div className="wrap hero-inner">
        <motion.div className="hero-copy" initial="hidden" animate="show" variants={stagger(0.1, 0.1)}>
          <motion.p className="badge" variants={fadeUp}>
            <span className="pulse" aria-hidden="true" /> Open to full-time roles · {profile.location}
          </motion.p>
          <motion.h1 variants={fadeUp}>
            Hi, I'm <span className="grad">{profile.name.split(" ")[0]}</span>.
            <span className="h1-line">I build <span className="typed">{typed}</span><span className="caret" aria-hidden="true" /></span>
          </motion.h1>
          <motion.p className="role-line" variants={fadeUp}>
            <BrandIcon name="react" size={20} /> <b>React Developer</b> · full-stack with Node, MongoDB &amp; AI
          </motion.p>
          <motion.p className="lede" variants={fadeUp}>{profile.headline}</motion.p>
          <motion.div className="cta" variants={fadeUp}>
            <Magnetic><a className="btn btn-primary" href="#projects">See my work</a></Magnetic>
            <Magnetic><a className="btn" href={profile.resume} download={RESUME_FILENAME} onClick={onResumeClick}>Download résumé</a></Magnetic>
            <Magnetic><a className="btn btn-ghost" href={profile.github} target="_blank" rel="noopener">GitHub ↗</a></Magnetic>
          </motion.div>
          <motion.div className="stats" variants={stagger(0.08)}>
            <Stat value={2} suffix="+" label="years shipping React" />
            <Stat value={components || 60} suffix="+" label="React components on GitHub" />
            <Stat value={projects.length} label="full-stack projects" />
          </motion.div>
        </motion.div>

        <motion.div className="hero-visual" initial={{ opacity: 0, scale: 0.94, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}>
          <ReactAtom />
          <CodeWindow />
          <motion.div className="float-badge fb-1" {...float(0)}>
            <BrandIcon name="react" size={18} /> {components ? `${components} React components` : "React specialist"}
          </motion.div>
          <motion.div className="float-badge fb-2" {...float(1.2)}>
            <BrandIcon name="claude" size={18} /> Claude Code
          </motion.div>
          <motion.div className="float-badge fb-3" {...float(2.4)}>
            <BrandIcon name="gemini" size={18} /> Gemini in production
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
