import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import LoginForm from "./LoginForm";

const { login } = vi.hoisted(() => ({ login: vi.fn() }));

vi.mock("@/modules/auth/useAuth", () => ({
  useAuth: () => ({ login }),
}));

describe("LoginForm", () => {
  it("submits credentials without offering public signup", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(
      screen.getByLabelText("Adresse e-mail"),
      "user@arbora.local",
    );
    await user.type(screen.getByLabelText("Mot de passe"), "secure-password");
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    expect(login).toHaveBeenCalledWith(
      "user@arbora.local",
      "secure-password",
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
