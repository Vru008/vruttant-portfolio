import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { projects } from "../lib/data";
import { matchesFilter } from "../lib/filters";
import { Projects } from "./Projects";

describe("<Projects />", () => {
  it("shows every project by default", () => {
    render(<Projects />);
    expect(screen.getAllByRole("article")).toHaveLength(projects.length);
  });

  it("filters by technology and reflects the pressed state", async () => {
    render(<Projects />);
    const ts = screen.getByRole("button", { name: "TypeScript" });
    await userEvent.click(ts);

    expect(ts).toHaveAttribute("aria-pressed", "true");
    const expected = projects.filter((p) => matchesFilter(p, "TypeScript"));
    // Filtered-out cards play an exit animation before they unmount.
    await waitFor(() => expect(screen.getAllByRole("article")).toHaveLength(expected.length));
    screen.getAllByRole("article").forEach((card) => expect(within(card).getByText("TypeScript")).toBeInTheDocument());
  });

  it("links live demos and source code in new tabs", () => {
    render(<Projects />);
    const demo = screen.getAllByRole("link", { name: /live demo/i })[0]!;
    expect(demo).toHaveAttribute("target", "_blank");
    expect(demo).toHaveAttribute("rel", "noopener");
  });
});

describe("matchesFilter", () => {
  it("treats Gemini-powered projects as AI", () => {
    expect(matchesFilter(projects.find((p) => p.id === "jobmate")!, "AI")).toBe(true);
    expect(matchesFilter(projects.find((p) => p.id === "bharatpulse")!, "AI")).toBe(false);
  });
});
