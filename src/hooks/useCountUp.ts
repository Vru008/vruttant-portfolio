import { useEffect, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

/** Eases from 0 to `target` over `ms`, starting when `start` becomes true. */
export function useCountUp(target: number, start = true, ms = 900) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start || reduced) return;
    let frame = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / ms);
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, start, ms, reduced]);

  return reduced ? target : value;
}
