import { motion } from "motion/react";
import type { ReactNode } from "react";
import { SplitHeading } from "./motion";

export function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`}>
      <div className="wrap">
        <motion.p className="eyebrow" initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5 }}>
          {eyebrow}
        </motion.p>
        <SplitHeading id={`${id}-title`} text={title} />
        {children}
      </div>
    </section>
  );
}
