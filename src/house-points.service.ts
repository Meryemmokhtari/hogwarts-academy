
import type { House, HousePoints } from "./types";

export class HousePointsService {
  private points: HousePoints = {
    Gryffindor: 0,
    Slytherin: 0,
    Ravenclaw: 0,
    Hufflepuff: 0
  };

  addPoints(house: House, amount: number): number {
    this.validateAmount(amount);

    this.points[house] += amount;

    return this.points[house];
  }

  removePoints(house: House, amount: number): number {
    this.validateAmount(amount);

    if (this.points[house] < amount) {
      throw new Error("Insufficient house points");
    }

    this.points[house] -= amount;

    return this.points[house];
  }

  getPoints(house: House): number {
    return this.points[house];
  }

  getRanking(): { house: House; points: number }[] {
    return (Object.entries(this.points) as [House, number][])
      .map(([house, points]) => ({ house, points }))
      .sort((a, b) => b.points - a.points);
  }

  private validateAmount(amount: number): void {
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new Error("Points amount must be a positive integer");
    }
  }
}
