import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(cleanup);

// jsdom lacks these browser APIs.
class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.IntersectionObserver ??= IO as unknown as typeof IntersectionObserver;
// Report reduced motion so animations resolve instantly in tests.
window.matchMedia ??= (query: string) =>
  ({ matches: query.includes("reduce"), media: query, addEventListener() {}, removeEventListener() {} }) as unknown as MediaQueryList;
Element.prototype.scrollIntoView ??= () => {};
