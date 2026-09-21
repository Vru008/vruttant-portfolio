import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { education, experience } from "../lib/data";
import { fadeUp, stagger } from "../lib/variants";

export function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  // The timeline rail fills in as the list scrolls through the viewport.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 80%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <>
      <ol className="timeline" ref={listRef}>
        <motion.span className="timeline-rail" style={{ scaleY }} aria-hidden="true" />
        {experience.map((r) => (
          <motion.li key={r.company} initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <div className="tl-head">
              <h3>{r.title} · <span className="company">{r.company}</span></h3>
              <span className="period">{r.period} · {r.place}</span>
            </div>
            <ul>{r.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
          </motion.li>
        ))}
      </ol>
      <h3 className="sub-title">Education</h3>
      <motion.div className="edu-grid" initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger(0.12)}>
        {education.map((e) => (
          <motion.div key={e.school} className="card edu" variants={fadeUp}>
            <h4>{e.degree}</h4>
            <p>{e.school}</p>
            <span className="period">{e.period}</span>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
