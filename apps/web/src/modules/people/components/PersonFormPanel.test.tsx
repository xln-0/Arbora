import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import PersonFormPanel from "./PersonFormPanel";

describe("PersonFormPanel", () => {
  it("normalizes and submits the critical person fields", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(
      <PersonFormPanel
        mode="create"
        persons={[]}
        relationships={[]}
        onSave={onSave}
        onClose={vi.fn()}
        onDeleteRelationship={vi.fn()}
        canEdit
      />,
    );

    await user.type(screen.getByLabelText(/Prénom/), "  Jeanne  ");
    await user.type(screen.getByLabelText("Nom"), "  Martin  ");
    await user.selectOptions(screen.getByLabelText("Sexe"), "FEMALE");
    fireEvent.change(screen.getByLabelText("Date de naissance"), {
      target: { value: "1984-03-12" },
    });
    fireEvent.change(screen.getByLabelText("Date de décès"), {
      target: { value: "2020-11-04" },
    });
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(onSave).toHaveBeenCalledWith({
      firstName: "Jeanne",
      lastName: "Martin",
      gender: "FEMALE",
      birthDate: "1984-03-12",
      deathDate: "2020-11-04",
    });
  });

  it("keeps submission disabled until a first name is entered", () => {
    render(
      <PersonFormPanel
        mode="create"
        persons={[]}
        relationships={[]}
        onSave={vi.fn()}
        onClose={vi.fn()}
        onDeleteRelationship={vi.fn()}
        canEdit
      />,
    );

    expect(
      screen.getByRole("button", { name: "Enregistrer" }),
    ).toBeDisabled();
  });
});
