import {
  siClaude, siCss, siExpress, siGit, siGithubactions, siGooglegemini, siHtml5, siJavascript, siMongodb,
  siNextdotjs, siNodedotjs, siPython, siReact, siReactrouter, siRender, siTypescript, siVercel, siVite, siVitest,
  type SimpleIcon,
} from "simple-icons";

// Named imports keep the bundle to just these paths (simple-icons is tree-shakeable).
const ICONS = {
  react: siReact, typescript: siTypescript, javascript: siJavascript, html: siHtml5, css: siCss,
  next: siNextdotjs, router: siReactrouter, node: siNodedotjs, express: siExpress, mongodb: siMongodb,
  claude: siClaude, gemini: siGooglegemini, actions: siGithubactions, vercel: siVercel, render: siRender,
  vite: siVite, vitest: siVitest, python: siPython, git: siGit,
} satisfies Record<string, SimpleIcon>;

export type IconName = keyof typeof ICONS | "chatgpt";

// Brand colours too dark to read on the dark theme fall back to the text colour.
const MONO = new Set<IconName>(["next", "express", "vercel", "render"]);

export function BrandIcon({ name, size = 22, color }: { name: IconName; size?: number; color?: string }) {
  if (name === "chatgpt") {
    // No official mark is published in simple-icons, so use a neutral chat glyph.
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke={color ?? "#10a37f"}
           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
        <path d="M9 11h.01M12 11h.01M15 11h.01" strokeWidth="3" />
      </svg>
    );
  }
  const icon = ICONS[name];
  const fill = color ?? (MONO.has(name) ? "currentColor" : `#${icon.hex}`);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill={fill}>
      <path d={icon.path} />
    </svg>
  );
}
