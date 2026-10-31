
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { AcademyService } from "../src/academy.service";
import { WizardRepository, SpellRepository } from "../src/repository";
import type { AcademyEvent } from "../src/types";

describe("AcademyService", () => {
  let wizards: WizardRepository;
  let spells: SpellRepository;
  let academy: AcademyService;

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});

    wizards = new WizardRepository();
    spells = new SpellRepository();

    wizards.add({
      id: 1,
      name: "Harry Potter",
      house: "Gryffindor",
      level: 5,
      active: true
    });

    wizards.add({
      id: 2,
      name: "Draco Malfoy",
      house: "Slytherin",
      level: 6,
      active: true
    });

    spells.add({
      id: 101,
      name: "Expelliarmus",
      category: "attack",
      power: 80
    });

    academy = new AcademyService(wizards, spells);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should cast a spell successfully", () => {
    expect(academy.castSpell(1, 101))
      .toBe("Harry Potter casts Expelliarmus!");
  });

  it("should throw an error when wizard does not exist", () => {
    expect(() => academy.castSpell(99, 101))
      .toThrow("Wizard or spell not found");
  });

  it("should throw an error when spell does not exist", () => {
    expect(() => academy.castSpell(1, 999))
      .toThrow("Wizard or spell not found");
  });

  it("should find wizards by house", () => {
    expect(academy.findByHouse("Gryffindor")).toEqual([
      {
        id: 1,
        name: "Harry Potter",
        house: "Gryffindor"
      }
    ]);
  });

  it("should update an existing wizard", () => {
    expect(academy.updateWizard(1, { level: 10 })).toBe(true);
    expect(wizards.findById(1)?.level).toBe(10);
  });

  it("should return false when wizard does not exist", () => {
    expect(academy.updateWizard(99, { level: 10 })).toBe(false);
  });

  it("should return only spell-cast events", () => {
    const events: AcademyEvent[] = [
      { type: "spell-cast", wizardId: 1, spellName: "Lumos" },
      { type: "level-up", wizardId: 2, newLevel: 7 },
      { type: "wizard-expelled", wizardId: 2 },
      { type: "spell-cast", wizardId: 1, spellName: "Accio" }
    ];

    expect(academy.getSpellEvents(events)).toEqual([
      { type: "spell-cast", wizardId: 1, spellName: "Lumos" },
      { type: "spell-cast", wizardId: 1, spellName: "Accio" }
    ]);
  });
});
