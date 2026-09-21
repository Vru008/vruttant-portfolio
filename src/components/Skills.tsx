import { motion } from "motion/react";
import type { StatsState } from "../hooks/useGitHubStats";
import { skills } from "../lib/data";
import { LanguageChart } from "./LanguageChart";
import { fadeUp, stagger } from "../lib/variants";

export function Skills({ stats }: { stats: StatsState }) {
  return (
    <div className="skills-layout">
      <motion.div className="skill-groups" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={stagger(0.1)}>
        {Object.entries(skills).map(([group, items]) => (
          <motion.div key={group} className={`skill-group ${group === "React" ? "skill-react" : ""}`} variants={fadeUp}>
            <h3>{group}</h3>
            <motion.ul className="chips" variants={stagger(0.03)}>
              {items.map((s) => (
                <motion.li key={s} variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1 } }}
                           whileHover={{ y: -3 }}>
                  {s}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        ))}
      </motion.div>
      <LanguageChart state={stats} />
    </div>
  );
}
