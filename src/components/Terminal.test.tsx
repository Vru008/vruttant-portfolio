import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { Terminal } from "./Terminal";

describe("<Terminal />", () => {
  it("runs a typed command and prints its output", async () => {
    render(<Terminal stats={null} onToggleTheme={() => {}} />);
    await userEvent.type(screen.getByLabelText("Terminal command"), "skills{Enter}");
    expect(screen.getByRole("log")).toHaveTextContent("Frontend");
  });

  it("recalls history with the up arrow and autocompletes with Tab", async () => {
    render(<Terminal stats={null} onToggleTheme={() => {}} />);
    const input = screen.getByLabelText("Terminal command");
    await userEvent.type(input, "about{Enter}{ArrowUp}");
    expect(input).toHaveValue("about");

    await userEvent.clear(input);
    await userEvent.type(input, "expe{Tab}");
    expect(input).toHaveValue("experience");
  });

  it("clears the screen and toggles the theme via commands", async () => {
    const onToggleTheme = vi.fn();
    render(<Terminal stats={null} onToggleTheme={onToggleTheme} />);
    await userEvent.click(screen.getByRole("button", { name: "help" }));
    expect(screen.getByRole("log")).toHaveTextContent("Available commands");

    const input = screen.getByLabelText("Terminal command");
    await userEvent.type(input, "clear{Enter}theme{Enter}");
    expect(onToggleTheme).toHaveBeenCalledOnce();
    expect(screen.getByRole("log")).not.toHaveTextContent("Available commands");
  });
});
