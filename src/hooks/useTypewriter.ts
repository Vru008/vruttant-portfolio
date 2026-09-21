import { useEffect, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

/** Types each word, pauses, deletes it, moves on. Static first word under reduced motion. */
export function useTypewriter(words: string[], { type = 70, erase = 35, hold = 1600 } = {}) {
  const reduced = useReducedMotion();
  const [state, setState] = useState({ word: 0, chars: 0, deleting: false });

  useEffect(() => {
    if (reduced) return;
    const full = words[state.word] ?? "";
    let delay = state.deleting ? erase : type;
    if (!state.deleting && state.chars === full.length) delay = hold;

    const id = setTimeout(() => {
      setState((s) => {
        const len = (words[s.word] ?? "").length;
        if (!s.deleting && s.chars === len) return { ...s, deleting: true };
        if (s.deleting && s.chars === 0) return { word: (s.word + 1) % words.length, chars: 0, deleting: false };
        return { ...s, chars: s.chars + (s.deleting ? -1 : 1) };
      });
    }, delay);
    return () => clearTimeout(id);
  }, [state, words, reduced, type, erase, hold]);

  if (reduced) return words[0] ?? "";
  return (words[state.word] ?? "").slice(0, state.chars);
}
