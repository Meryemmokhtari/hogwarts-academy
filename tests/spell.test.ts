
import { describe, it, expect } from "vitest";
import { SpellRepository } from "../src/repository";
import type { Spell } from "../src/types";

describe("SpellRepository", () => {
  const createSpell = (overrides: Partial<Spell> = {}): Spell => ({
    id: 101,
    name: "Expelliarmus",
    category: "attack",
    power: 80,
    ...overrides,
  });

  it("should add a valid spell", () => {
    const repository = new SpellRepository();
    const spell = createSpell();

    repository.add(spell);

    expect(repository.getAll()).toHaveLength(1);
    expect(repository.findById(101)).toEqual(spell);
  });

  it("should reject a spell with negative power", () => {
    const repository = new SpellRepository();
    const invalidSpell = createSpell({ power: -10 });

    expect(() => repository.add(invalidSpell)).toThrow(
      "Invalid spell power: -10. Power cannot be negative."
    );
  });

  it("should not store a spell with negative power", () => {
    const repository = new SpellRepository();

    expect(() =>
      repository.add(createSpell({ power: -10 }))
    ).toThrow();

    expect(repository.getAll()).toHaveLength(0);
  });
});
