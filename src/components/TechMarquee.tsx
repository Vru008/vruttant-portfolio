import { BrandIcon, type IconName } from "./BrandIcon";

const TECH: [IconName, string][] = [
  ["react", "React"], ["typescript", "TypeScript"], ["javascript", "JavaScript"], ["next", "Next.js"],
  ["router", "React Router"], ["node", "Node.js"], ["express", "Express"], ["mongodb", "MongoDB"],
  ["claude", "Claude"], ["chatgpt", "ChatGPT"], ["gemini", "Gemini"], ["vite", "Vite"], ["vitest", "Vitest"],
  ["html", "HTML5"], ["css", "CSS3"], ["actions", "GitHub Actions"], ["vercel", "Vercel"], ["git", "Git"],
];

/** Infinite, pause-on-hover logo strip. The list is rendered twice so the loop is seamless. */
export function TechMarquee() {
  return (
    <div className="marquee" aria-label="Technologies I work with">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1 || undefined}>
            {TECH.map(([icon, label]) => (
              <li key={label}><BrandIcon name={icon} size={22} /> {label}</li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
