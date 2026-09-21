// Small reusable motion primitives shared across sections.
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { stagger } from "../lib/variants";
import { useRef, type MouseEvent, type ReactNode } from "react";

/** Thin gradient bar pinned to the top that tracks page scroll. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}

/** Heading whose words rise in one after another when scrolled into view. */
export function SplitHeading({ text, id }: { text: string; id?: string }) {
  return (
    <motion.h2 id={id} className="split-heading" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }}
               variants={stagger(0.06)} aria-label={text}>
      {text.split(" ").map((word, i) => (
        <span className="word-mask" key={i} aria-hidden="true">
          <motion.span className="word" variants={{ hidden: { y: "110%" }, show: { y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}>
            {word}
          </motion.span>
        </span>
      ))}
    </motion.h2>
  );
}

/** Pulls its child slightly toward the cursor, the "magnetic button" effect. */
export function Magnetic({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(0, { stiffness: 250, damping: 18 });
  const y = useSpring(0, { stiffness: 250, damping: 18 });

  const onMove = (e: MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.span ref={ref} className="magnetic" style={{ x, y }} onMouseMove={onMove} onMouseLeave={reset}>
      {children}
    </motion.span>
  );
}

/** 3D tilt toward the cursor plus a spotlight that follows it (via CSS vars). */
export function TiltCard({ children, className = "", max = 6 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 200, damping: 20 });

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const fx = (e.clientX - r.left) / r.width;
    const fy = (e.clientY - r.top) / r.height;
    px.set(fx);
    py.set(fy);
    el.style.setProperty("--mx", `${fx * 100}%`);
    el.style.setProperty("--my", `${fy * 100}%`);
  };
  const reset = () => { px.set(0.5); py.set(0.5); };

  return (
    <motion.div ref={ref} className={`tilt ${className}`} style={{ rotateX, rotateY, transformPerspective: 1000 }}
                onMouseMove={onMove} onMouseLeave={reset}>
      {children}
    </motion.div>
  );
}
