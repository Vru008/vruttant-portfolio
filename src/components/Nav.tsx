import { useState } from "react";
import { useActiveSection } from "../hooks/useActiveSection";
import type { Theme } from "../hooks/useTheme";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "ai", label: "AI" },
  { id: "terminal", label: "Terminal" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];
const IDS = SECTIONS.map((s) => s.id);

export function Nav({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  const active = useActiveSection(IDS);
  const [open, setOpen] = useState(false);

  return (
    <header className={`nav ${open ? "open" : ""}`}>
      <div className="wrap nav-inner">
        <a href="#top" className="logo" aria-label="Back to top">
          <span className="logo-mark">VP</span>
          <span className="logo-text">Vruttant<span className="accent">.dev</span></span>
        </a>
        <nav aria-label="Primary">
          <ul className="nav-links">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className={active === s.id ? "active" : undefined}
                   aria-current={active === s.id ? "true" : undefined} onClick={() => setOpen(false)}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav-actions">
          <button className="icon-btn" onClick={onToggleTheme}
                  aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
            {theme === "dark" ? "☀" : "☾"}
          </button>
          <button className="icon-btn menu-btn" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </header>
  );
}
