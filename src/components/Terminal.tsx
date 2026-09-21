import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { complete, runCommand, type Line } from "../lib/commands";
import type { GitHubStats } from "../lib/github";

interface Entry { id: number; line: Line }

const QUICK = ["help", "projects", "ai", "github", "sudo hire-me"];
const PROMPT = "visitor@vru008:~$";
let nextId = 0;
const toEntries = (lines: Line[]): Entry[] => lines.map((line) => ({ id: nextId++, line }));

export function Terminal({ stats, onToggleTheme }: { stats: GitHubStats | null; onToggleTheme: () => void }) {
  const [entries, setEntries] = useState<Entry[]>(() =>
    toEntries([{ text: "Welcome! This terminal is a React component. Type `help` or click a command below.", kind: "accent" }]),
  );
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(0);
  const outRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const out = outRef.current;
    if (out) out.scrollTop = out.scrollHeight;
  }, [entries]);

  const exec = (raw: string) => {
    const res = runCommand(raw, { stats });
    const echo: Line = { text: `${PROMPT} ${raw}`, kind: "muted" };
    const e = res.effect;
    if (e?.type === "clear") setEntries([]);
    else setEntries((prev) => [...prev, ...toEntries([echo, ...res.lines])]);
    if (e?.type === "open") window.open(e.url, "_blank", "noopener");
    if (e?.type === "theme") onToggleTheme();
    if (e?.type === "scroll") document.getElementById(e.target)?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (raw.trim()) {
      const next = [...history, raw];
      setHistory(next);
      setCursor(next.length);
    }
  };

  const onKeyDown = (ev: KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === "Enter") {
      exec(value);
      setValue("");
    } else if (ev.key === "ArrowUp" && cursor > 0) {
      ev.preventDefault();
      setCursor(cursor - 1);
      setValue(history[cursor - 1] ?? "");
    } else if (ev.key === "ArrowDown") {
      ev.preventDefault();
      const c = Math.min(history.length, cursor + 1);
      setCursor(c);
      setValue(history[c] ?? "");
    } else if (ev.key === "Tab") {
      const c = complete(value);
      if (c) { ev.preventDefault(); setValue(c); }
    }
  };

  return (
    <div className="terminal" onClick={() => inputRef.current?.focus({ preventScroll: true })}>
      <div className="term-bar" aria-hidden="true">
        <i /><i /><i /><span>vru008 — zsh</span>
      </div>
      <div className="term-output" ref={outRef} role="log" aria-live="polite" aria-label="Terminal output">
        {entries.map(({ id, line }) =>
          line.href ? (
            <a key={id} className={`term-line ${line.kind ?? ""}`} href={line.href}
               {...(line.href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener" })}>
              {line.text}
            </a>
          ) : (
            <div key={id} className={`term-line ${line.kind ?? ""}`}>{line.text}</div>
          ),
        )}
      </div>
      <label className="term-input-row">
        <span className="term-prompt">{PROMPT}</span>
        <input ref={inputRef} className="term-input" value={value} onChange={(e) => setValue(e.target.value)}
               onKeyDown={onKeyDown} spellCheck={false} autoComplete="off" autoCapitalize="off"
               aria-label="Terminal command" placeholder="type help" />
      </label>
      <div className="term-quick">
        {QUICK.map((c) => (
          <button key={c} type="button" onClick={(ev) => { ev.stopPropagation(); exec(c); }}>{c}</button>
        ))}
      </div>
    </div>
  );
}
