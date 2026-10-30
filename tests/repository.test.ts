
import { describe, it, expect } from "vitest";
import { WizardRepository } from "../src/repository";
import type { Wizard } from "../src/types";

describe("WizardRepository", () => {
  const createWizard = (
    overrides: Partial<Wizard> = {}
  ): Wizard => ({
    id: 1,
    name: "Harry Potter",
    house: "Gryffindor",
    level: 5,
    active: true,
    ...overrides,
  });

  it("should add a wizard with an automatically generated ID", () => {
    const repository = new WizardRepository();

    const wizard = repository.addWizard({
      name: "Harry Potter",
      house: "Gryffindor",
      level: 5,
      active: true,
    });

    expect(wizard.id).toBe(1);
    expect(wizard.name).toBe("Harry Potter");
    expect(repository.getAll()).toHaveLength(1);
  });

  it("should generate incremental IDs", () => {
    const repository = new WizardRepository();

    const first = repository.addWizard({
      name: "Harry Potter",
      house: "Gryffindor",
      level: 5,
      active: true,
    });

    const second = repository.addWizard({
      name: "Draco Malfoy",
      house: "Slytherin",
      level: 6,
      active: true,
    });

    expect(first.id).toBe(1);
    expect(second.id).toBe(2);
  });

  it("should find wizards by house", () => {
    const repository = new WizardRepository();

    repository.add(createWizard());
    repository.add(
      createWizard({
        id: 2,
        name: "Hermione Granger",
      })
    );
    repository.add(
      createWizard({
        id: 3,
        name: "Draco Malfoy",
        house: "Slytherin",
      })
    );

    const result = repository.findByHouse("Gryffindor");

    expect(result).toHaveLength(2);
    expect(result.map((wizard) => wizard.name)).toEqual([
      "Harry Potter",
      "Hermione Granger",
    ]);
  });

  it("should update an existing wizard", () => {
    const repository = new WizardRepository();

    repository.add(createWizard());

    const updated = repository.update(1, { level: 8 });

    expect(updated).toBe(true);
    expect(repository.findById(1)?.level).toBe(8);
  });

  it("should return false when updating a non-existing wizard", () => {
    const repository = new WizardRepository();

    const updated = repository.update(999, { level: 8 });

    expect(updated).toBe(false);
  });
});
