import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Event, Person, Relationship } from "@arbora/shared";

import EventFormPanel from "./EventFormPanel";

const people: Person[] = [
  {
    id: "person-thomas",
    treeId: "tree-id",
    firstName: "Thomas",
    lastName: "Martin",
    gender: "MALE",
    positionX: 0,
    positionY: 0,
  },
  {
    id: "person-olivier",
    treeId: "tree-id",
    firstName: "Olivier",
    lastName: "Martin",
    gender: "MALE",
    positionX: 0,
    positionY: 0,
  },
];

const coupleRelationship: Relationship = {
  id: "relationship-couple",
  treeId: "tree-id",
  sourcePersonId: "person-thomas",
  targetPersonId: "person-olivier",
  type: "FREE_UNION",
};

const residenceEvent: Event = {
  id: "event-residence",
  treeId: "tree-id",
  personId: "person-thomas",
  relationshipId: null,
  type: "RESIDENCE",
  title: "Installation à Lyon",
  date: "1998-09-01",
  place: "Lyon",
  description: "Première maison",
  createdAt: "2026-08-13T00:00:00.000Z",
  updatedAt: "2026-08-13T00:00:00.000Z",
};

describe("EventFormPanel", () => {
  it("creates an event for the displayed person", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(
      <EventFormPanel
        personName="Thomas Martin"
        personId="person-thomas"
        persons={[]}
        relationships={[]}
        onSave={onSave}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText("Thomas Martin")).toBeInTheDocument();
    await user.selectOptions(
      screen.getByLabelText("Type d’événement"),
      "RESIDENCE",
    );
    await user.type(
      screen.getByLabelText("Titre (optionnel)"),
      "Déménagement à Lyon",
    );
    fireEvent.change(screen.getByLabelText("Date"), {
      target: { value: "1998-09-01" },
    });
    await user.type(screen.getByLabelText("Lieu"), "Lyon");
    await user.type(
      screen.getByLabelText("Description"),
      "Installation dans une nouvelle maison",
    );
    await user.click(screen.getByRole("button", { name: "Ajouter" }));

    expect(onSave).toHaveBeenCalledWith({
      type: "RESIDENCE",
      title: "Déménagement à Lyon",
      date: "1998-09-01",
      place: "Lyon",
      description: "Installation dans une nouvelle maison",
    });
  });

  it("allows an event without a title", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(
      <EventFormPanel
        personName="Thomas Martin"
        personId="person-thomas"
        persons={[]}
        relationships={[]}
        onSave={onSave}
        onClose={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("Date"), {
      target: { value: "2002-05-14" },
    });
    await user.click(screen.getByRole("button", { name: "Ajouter" }));

    expect(onSave).toHaveBeenCalledWith({
      type: "OTHER",
      date: "2002-05-14",
    });
  });

  it("requires and submits the second person for a marriage", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(
      <EventFormPanel
        personName="Thomas Martin"
        personId="person-thomas"
        persons={people}
        relationships={[coupleRelationship]}
        onSave={onSave}
        onClose={vi.fn()}
      />,
    );

    await user.selectOptions(screen.getByLabelText("Type d’événement"), "MARRIAGE");
    await user.selectOptions(
      screen.getByLabelText("Deuxième personne"),
      coupleRelationship.id,
    );
    fireEvent.change(screen.getByLabelText("Date"), {
      target: { value: "2010-06-19" },
    });
    await user.click(screen.getByRole("button", { name: "Ajouter" }));

    expect(onSave).toHaveBeenCalledWith({
      type: "MARRIAGE",
      date: "2010-06-19",
      relationshipId: coupleRelationship.id,
    });
  });

  it("prefills and updates an existing event", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(
      <EventFormPanel
        personName="Thomas Martin"
        personId="person-thomas"
        persons={people}
        relationships={[coupleRelationship]}
        mode="edit"
        initialData={residenceEvent}
        onSave={onSave}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByRole("heading", { name: "Modifier l’événement" })).toBeInTheDocument();
    expect(screen.getByLabelText("Titre (optionnel)")).toHaveValue(
      "Installation à Lyon",
    );
    await user.clear(screen.getByLabelText("Titre (optionnel)"));
    await user.clear(screen.getByLabelText("Lieu"));
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(onSave).toHaveBeenCalledWith({
      type: "RESIDENCE",
      date: "1998-09-01",
      relationshipId: null,
      description: "Première maison",
    });
  });
});
