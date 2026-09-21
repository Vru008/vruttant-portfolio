import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { aiPrinciples, aiTools } from "../lib/data";
import { BrandIcon } from "./BrandIcon";
import { fadeUp, stagger } from "../lib/variants";
import { TiltCard } from "./motion";

const TOOL_COLOR = { claude: "#d97757", chatgpt: "#10a37f", gemini: "#8e75b2" } as const;

// Illustrative response; the system instruction and schema match JobMate's real /api/ai/match-resume route.
const RESPONSE = {
  score: 86,
  summary: "Strong React match with shipped full-stack work.",
  strengths: ["2+ yrs production React", "JWT auth + RBAC", "LLM integration"],
  gaps: ["No GraphQL mentioned"],
};
const RESPONSE_TEXT = JSON.stringify(RESPONSE, null, 2);

function ScoreRing({ score }: { score: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <svg className="score-ring" viewBox="0 0 84 84" role="img" aria-label={`Match score ${score} out of 100`}>
      <circle cx="42" cy="42" r={r} className="ring-track" />
      <motion.circle cx="42" cy="42" r={r} className="ring-value" strokeDasharray={c}
                     initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - score / 100) }}
                     transition={{ duration: 1.2, ease: "easeOut" }} />
      <text x="42" y="48" textAnchor="middle">{score}</text>
    </svg>
  );
}

/** Streams a model response into view, then renders it as typed React UI. */
function AIDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();
  const [chars, setChars] = useState(0);
  const [run, setRun] = useState(0);
  const shown = reduced ? RESPONSE_TEXT.length : chars;
  const done = shown >= RESPONSE_TEXT.length;

  useEffect(() => {
    if (!inView || reduced || done) return;
    const id = setTimeout(() => setChars((c) => Math.min(RESPONSE_TEXT.length, c + 3)), 16);
    return () => clearTimeout(id);
  }, [inView, reduced, done, chars, run]);

  const replay = () => { setChars(0); setRun((r) => r + 1); };

  return (
    <div className="ai-demo card" ref={ref}>
      <div className="ai-demo-head">
        <div>
          <p className="eyebrow">Live pattern · JobMate résumé ↔ job match</p>
          <h3>Prompt → typed JSON → React UI</h3>
        </div>
        <button className="btn small-btn" onClick={replay} disabled={!done}>↻ Replay</button>
      </div>
      <div className="ai-demo-grid">
        <div className="ai-pane">
          <span className="pane-label">request · server-side</span>
          <pre className="ai-code">
{`model: "gemini-2.5-flash"
system: "You are a technical recruiter.
  Score how well a resume matches a job."
responseSchema: {
  score: INTEGER, summary: STRING,
  strengths: STRING[], gaps: STRING[]
}`}
          </pre>
        </div>
        <div className="ai-pane">
          <span className="pane-label">response · streaming</span>
          <pre className="ai-code ai-json">{RESPONSE_TEXT.slice(0, shown)}{!done && <span className="code-caret" />}</pre>
        </div>
        <div className="ai-pane ai-result">
          <span className="pane-label">rendered · React</span>
          <AnimatePresence>
            {done && (
              <motion.div key={run} className="result-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <ScoreRing score={RESPONSE.score} />
                <p className="result-summary">{RESPONSE.summary}</p>
                <ul className="result-tags">
                  {RESPONSE.strengths.map((s) => <li key={s} className="ok">✓ {s}</li>)}
                  {RESPONSE.gaps.map((s) => <li key={s} className="gap">△ {s}</li>)}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <p className="muted small">The prompt and schema come from JobMate's real route. The response shown here is an illustrative example.</p>
    </div>
  );
}

export function AIToolkit() {
  return (
    <>
      <motion.div className="ai-grid" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger(0.12)}>
        {aiTools.map((t) => (
          <motion.div key={t.id} variants={fadeUp}>
            <TiltCard className="card ai-card">
              <div className="ai-card-inner" style={{ ["--tool" as string]: TOOL_COLOR[t.id] }}>
                <div className="ai-card-top">
                  <span className="ai-icon"><BrandIcon name={t.id} size={28} /></span>
                  <div>
                    <h3>{t.name}</h3>
                    <p className="ai-role">{t.role}</p>
                  </div>
                </div>
                <ul className="highlights">{t.points.map((p) => <li key={p}>{p}</li>)}</ul>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>
      <motion.ul className="principles" initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger(0.1)}>
        {aiPrinciples.map((p) => <motion.li key={p} variants={fadeUp}>{p}</motion.li>)}
      </motion.ul>
      <AIDemo />
    </>
  );
}
