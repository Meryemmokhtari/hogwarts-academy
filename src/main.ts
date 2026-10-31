import {
  type Spell,
  type AcademyEvent,
  type SpellCastEvent,
  type House,
  type HousePoints,
  type SpellCategory,
  type SpellOutput,
  type ArrayElement,
  type WizardSummary,
  type WizardUpdate,
  type AttackSpell,
  type NonHealingCategory,
} from "./types";

import { WizardRepository, SpellRepository } from "./repository";
import { Log, Cache } from "./decorators";
import { isHouse, isWizard } from "./guards";
import { HousePointsService } from "./house-points.service";



class AcademyService {
  constructor(
    private readonly wizards: WizardRepository,
    private readonly spells: SpellRepository
  ) {}

  @Log
  castSpell(wizardId: number, spellId: number): string {
    const wizard = this.wizards.findById(wizardId);
    const spell = this.spells.findById(spellId);

    if (!wizard || !spell) {
      throw new Error("Wizard or spell not found");
    }

    return `${wizard.name} casts ${spell.name}!`;
  }

  findByHouse(house: House): WizardSummary[] {
    return this.wizards
      .getAll()
      .filter(wizard => wizard.house === house)
      .map(({ id, name, house }) => ({ id, name, house }));
  }

  updateWizard(id: number, changes: WizardUpdate): boolean {
    return this.wizards.update(id, changes);
  }

  @Cache
  getSpellEvents(events: AcademyEvent[]): SpellCastEvent[] {
    return events.filter(
      (event): event is SpellCastEvent =>
        event.type === "spell-cast"
    );
  }
}

const wizards = new WizardRepository();
const spells = new SpellRepository();

wizards.add({
  id: 1,
  name: "Harry Potter",
  house: "Gryffindor",
  level: 5,
  active: true,
  patronus: "Stag"
});

wizards.add({
  id: 2,
  name: "Hermione Granger",
  house: "Gryffindor",
  level: 8,
  active: true
});

wizards.add({
  id: 3,
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

spells.add({
  id: 102,
  name: "Protego",
  category: "defense",
  power: 60
});

const academy = new AcademyService(wizards, spells);

console.log("\n--- Cast a spell ---");
console.log(academy.castSpell(1, 101));

console.log("\n--- Find wizards by house ---");
console.log(academy.findByHouse("Gryffindor"));

console.log("\n--- Update a wizard ---");
academy.updateWizard(1, { level: 6 });
console.log(wizards.findById(1));

console.log("\n--- Type guard ---");
const unknownWizard: unknown = wizards.findById(1);
if (isWizard(unknownWizard)) {
  console.log(`${unknownWizard.name} belongs to ${unknownWizard.house}`);
}

console.log("\n--- Record utility type ---");
const points: HousePoints = {
  Gryffindor: 100,
  Slytherin: 80,
  Ravenclaw: 90,
  Hufflepuff: 70
};
console.log(points);

console.log("\n--- Extract spell-cast events ---");
const events: AcademyEvent[] = [
  { type: "spell-cast", wizardId: 1, spellName: "Lumos" },
  { type: "level-up", wizardId: 2, newLevel: 9 },
  { type: "wizard-expelled", wizardId: 3 }
];
console.log(academy.getSpellEvents(events));

// Compile-time demonstrations: these aliases are checked by TypeScript.
type CastArguments = Parameters<AcademyService["castSpell"]>;
type CastResult = ReturnType<AcademyService["castSpell"]>;
type AttackOutput = SpellOutput<"attack">; // number
type HealingOutput = SpellOutput<"healing">; // string
type SpellItem = ArrayElement<Spell[]>; // Spell
type AttackSpellExample = AttackSpell;
type RemainingCategories = NonHealingCategory;
type CategoryExample = SpellCategory;

const typeExamples: [
  CastArguments,
  CastResult,
  AttackOutput,
  HealingOutput,
  SpellItem,
  AttackSpellExample["category"],
  RemainingCategories,
  CategoryExample
] | null = null;

void typeExamples;

// Exercise 1: Add a wizard without providing an ID.
console.log("\n--- Exercise 1: Add wizard without ID ---");

const newWizard = wizards.addWizard({
  name: "Ron Weasley",
  house: "Gryffindor",
  level: 4,
  active: true
});

console.log("New wizard:", newWizard);
console.log("All wizards:", wizards.getAll());

// Exercise 2: Find wizards by house.
console.log("\n--- Exercise 2: Find wizards by house ---");
console.log("Gryffindor:", wizards.findByHouse("Gryffindor"));
console.log("Slytherin:", wizards.findByHouse("Slytherin"));



// Exercise 4: Validate spell power using a decorator.
console.log("\n--- Exercise 4: Validate spell power ---");

try {
  spells.add({
    id: 103,
    name: "Lumos",
    category: "healing",
    power: 30
  });

  console.log("Valid spell added successfully.");

  spells.add({
    id: 104,
    name: "Dark Spell",
    category: "attack",
    power: -10
  });
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error("Spell rejected:", error.message);
  }
}

console.log("All spells:", spells.getAll());



// Exercise 5: Test Cache decorator.
console.log("\n--- Exercise 5: Cache decorator ---");

console.log("First call:");
console.log(academy.getSpellEvents(events));

console.log("Second call (same arguments):");
console.log(academy.getSpellEvents(events));


// Additional cache test with new arguments.
console.log("\n--- Cache test with new events ---");

const cacheTestEvents: AcademyEvent[] = [
  { type: "spell-cast", wizardId: 2, spellName: "Accio" }
];

console.log("First call:");
console.log(academy.getSpellEvents(cacheTestEvents));

console.log("Second call:");
console.log(academy.getSpellEvents(cacheTestEvents));

// Exercise 6: Test stricter type guards
console.log("\n--- Exercise 6: Type Guards ---");

const validHouse: unknown = "Gryffindor";
const invalidHouse: unknown = "Beauxbatons";

console.log("Valid house:", isHouse(validHouse));     // true
console.log("Invalid house:", isHouse(invalidHouse)); // false

const validWizard: unknown = {
  id: 5,
  name: "Neville Longbottom",
  house: "Gryffindor",
  level: 3,
  active: true
};

const invalidWizard: unknown = {
  id: 6,
  name: "Pansy Parkinson",
  house: "Beauxbatons",
  level: 3,
  active: true
};

console.log("Valid wizard:", isWizard(validWizard));     // true
console.log("Invalid wizard:", isWizard(invalidWizard)); // false




// Exercise 7: House Points Management
console.log("\n--- Exercise 7: House Points Management ---");

const housePoints = new HousePointsService();

housePoints.addPoints("Gryffindor", 50);
housePoints.addPoints("Slytherin", 30);
housePoints.addPoints("Ravenclaw", 40);
housePoints.addPoints("Hufflepuff", 20);

console.log("\nHouse points:");
console.table(housePoints.getRanking());

housePoints.removePoints("Slytherin", 10);

console.log("\nUpdated house ranking:");
console.table(housePoints.getRanking());
