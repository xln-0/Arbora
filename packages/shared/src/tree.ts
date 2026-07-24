import { Person } from "./person";
import { Relationship } from "./relationship";

export interface FamilyTree {
  id: string;

  name: string;

  persons: Person[];

  relationships: Relationship[];
}
