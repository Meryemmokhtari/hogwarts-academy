import type { Wizard, Spell, NewWizard, House, WizardSummary } from "./types";
import { Log, MeasureTime } from "./decorators";

export class Repository<T extends { id: number }> {
  private items: T[] = [];

  @Log
  add(item: T): void {
    this.items.push(item);
  }

  @MeasureTime
  findById(id: number): T | undefined {
    return this.items.find(item => item.id === id);
  }

  getAll(): T[] {
    return [...this.items];
  }

  update(id: number, changes: Partial<T>): boolean {
    const item = this.findById(id);

    if (!item) return false;

    Object.assign(item, changes);
    return true;
  }
}

export class WizardRepository extends Repository<Wizard> {
  addWizard(wizard: NewWizard): Wizard {
    const id = Math.max(0, ...this.getAll().map(w => w.id)) + 1;

    const newWizard: Wizard = { ...wizard, id };

    super.add(newWizard);

    return newWizard;
  }

  findByHouse(house: House): WizardSummary[] {
    return this.getAll()
      .filter(wizard => wizard.house === house)
      .map(({ id, name, house }) => ({ id, name, house }));
  }
}

export class SpellRepository extends Repository<Spell> {}
