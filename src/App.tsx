import { MotionConfig } from "motion/react";
import { AIToolkit } from "./components/AIToolkit";
import { Contact } from "./components/Contact";
import { Experience } from "./components/Experience";
import { Hero } from "./components/Hero";
import { ScrollProgress } from "./components/motion";
import { Nav } from "./components/Nav";
import { Projects } from "./components/Projects";
import { Reveal } from "./components/Reveal";
import { Section } from "./components/Section";
import { Skills } from "./components/Skills";
import { TechMarquee } from "./components/TechMarquee";
import { Terminal } from "./components/Terminal";
import { useGitHubStats } from "./hooks/useGitHubStats";
import { useTheme } from "./hooks/useTheme";
import { profile } from "./lib/data";

export default function App() {
  const { theme, toggle } = useTheme();
  const stats = useGitHubStats();
  const ready = stats.status === "ready" ? stats.stats : null;

  return (
    // reducedMotion="user" makes every motion component respect the OS setting.
    <MotionConfig reducedMotion="user">
      <a className="skip" href="#projects">Skip to projects</a>
      <ScrollProgress />
      <Nav theme={theme} onToggleTheme={toggle} />
      <main>
        <Hero stats={ready} />
        <TechMarquee />
        <Section id="about" eyebrow="01 · About" title="React first, full-stack when it counts">
          <Reveal className="about-grid">
            <p className="about-text">{profile.summary}</p>
            <ul className="about-points">
              <li><b>React, deeply</b>: hooks, context, routing, component systems, motion</li>
              <li><b>End-to-end ownership</b>: auth, REST APIs, MongoDB, deployment</li>
              <li><b>AI-native</b>: I build with Claude, ChatGPT and Gemini, and ship LLM features</li>
              <li><b>Quality</b>: typed code, unit tests, accessibility, responsive layouts</li>
            </ul>
          </Reveal>
        </Section>
        <Section id="projects" eyebrow="02 · Projects" title="Things I've built and shipped">
          <Projects />
        </Section>
        <Section id="skills" eyebrow="03 · Skills" title="The stack I reach for">
          <Skills stats={stats} />
        </Section>
        <Section id="ai" eyebrow="04 · AI toolkit" title="How I build with Claude, ChatGPT and Gemini">
          <AIToolkit />
        </Section>
        <Section id="terminal" eyebrow="05 · Try it" title="Explore my portfolio from a terminal">
          <Reveal>
            <Terminal stats={ready} onToggleTheme={toggle} />
          </Reveal>
        </Section>
        <Section id="experience" eyebrow="06 · Experience" title="Where I've worked">
          <Experience />
        </Section>
        <Section id="contact" eyebrow="07 · Contact" title="Let's build something">
          <Reveal><Contact /></Reveal>
        </Section>
      </main>
      <footer className="footer">
        <div className="wrap">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>Built with React 19, TypeScript, Vite &amp; Motion · tested with Vitest</span>
        </div>
      </footer>
    </MotionConfig>
  );
}
