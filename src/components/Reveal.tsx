import { motion } from "motion/react";
import type { ReactNode } from "react";

/** Fades/slides its children in the first time they scroll into view. */
export function Reveal({ className = "", delay = 0, children }: { className?: string; delay?: number; children: ReactNode }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.6, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}
