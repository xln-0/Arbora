import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { Person } from "@arbora/shared";

import RelationshipFormPanel from "./RelationshipFormPanel";

const olivier: Person = {
  id: "person-olivier",
  treeId: "tree-id",
  firstName: "Olivier",
  lastName: "Martin",
  gender: "MALE",
  birthDate: null,
  deathDate: null,
  positionX: 0,
  positionY: 0,
};

describe("RelationshipFormPanel", () => {
  it("submits all marriage milestones", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(
      <RelationshipFormPanel
        persons={[olivier]}
        onSave={onSave}
        onClose={vi.fn()}
      />,
    );

    await user.selectOptions(
      screen.getByLabelText(/Cette personne/),
      olivier.id,
    );
    await user.selectOptions(screen.getByLabelText(/est son\/sa/), "MARRIAGE");
    fireEvent.change(screen.getByLabelText("Date de début de l’union"), {
      target: { value: "2008-04-01" },
    });
    fireEvent.change(screen.getByLabelText("Date du mariage"), {
      target: { value: "2010-06-19" },
    });
    await user.click(screen.getByRole("button", { name: "Ajouter" }));

    expect(onSave).toHaveBeenCalledWith({
      targetPersonId: olivier.id,
      type: "MARRIAGE",
      unionDate: "2008-04-01",
      marriageDate: "2010-06-19",
    });
  });

  it("does not expose couple dates for a parent relationship", () => {
    render(
      <RelationshipFormPanel
        persons={[olivier]}
        onSave={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.queryByLabelText("Date de début de l’union"),
    ).not.toBeInTheDocument();
  });
});
