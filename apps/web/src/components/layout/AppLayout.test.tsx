import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { AppLayout } from "./AppLayout";

describe("AppLayout", () => {
  it("opens and closes the mobile navigation", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AppLayout title="Family tree">
          <p>Content</p>
        </AppLayout>
      </MemoryRouter>,
    );

    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toHaveClass("-translate-x-full");

    await user.click(
      screen.getByRole("button", { name: "Ouvrir la navigation" }),
    );
    expect(sidebar).toHaveClass("translate-x-0");
    expect(
      screen.getByRole("button", { name: "Ouvrir la navigation" }),
    ).toHaveAttribute("aria-expanded", "true");

    await user.click(
      screen.getAllByRole("button", { name: "Fermer la navigation" })[0],
    );
    expect(sidebar).toHaveClass("-translate-x-full");
  });
});
