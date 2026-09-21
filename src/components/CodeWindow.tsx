import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { sliceTokens, tokenize } from "../lib/highlight";

const CODE = `export function Developer() {
  const stack = useStack(["React", "TS", "Node"]);
  const ai = useAI(["Claude", "GPT", "Gemini"]);

  return (
    <Portfolio
      name="Vruttant Patoliya"
      role="React Developer"
      experience={2}
      openToWork
    />
  );
}`;

/** An editor window that types out a React component, then idles with a blinking caret. */
export function CodeWindow() {
  const reduced = useReducedMotion();
  const tokens = useMemo(() => tokenize(CODE), []);
  const [chars, setChars] = useState(0);
  const shown = reduced ? CODE.length : chars;

  useEffect(() => {
    if (reduced || chars >= CODE.length) return;
    // Type faster through whitespace so indentation doesn't feel sluggish.
    const next = CODE[chars];
    const id = setTimeout(() => setChars((c) => c + 1), next === " " ? 8 : 26);
    return () => clearTimeout(id);
  }, [chars, reduced]);

  const lines = CODE.slice(0, shown).split("\n").length;

  return (
    <div className="code-window" role="img" aria-label="Code editor showing a React component named Developer">
      <div className="code-bar" aria-hidden="true">
        <i /><i /><i />
        <span className="code-tab">Developer.tsx</span>
      </div>
      <div className="code-body" aria-hidden="true">
        <div className="gutter">
          {Array.from({ length: CODE.split("\n").length }, (_, i) => (
            <span key={i} className={i < lines ? "on" : ""}>{i + 1}</span>
          ))}
        </div>
        <pre>
          <code>
            {sliceTokens(tokens, shown).map((t, i) => <span key={i} className={`tk-${t.kind}`}>{t.text}</span>)}
            <span className="code-caret" />
          </code>
        </pre>
      </div>
    </div>
  );
}
