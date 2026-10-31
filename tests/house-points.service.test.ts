
import { describe, it, expect, beforeEach } from "vitest";
import { HousePointsService } from "../src/house-points.service";

describe("HousePointsService", () => {
  let service: HousePointsService;

  beforeEach(() => {
    service = new HousePointsService();
  });

  it("should initialize all houses with zero points", () => {
    expect(service.getPoints("Gryffindor")).toBe(0);
    expect(service.getPoints("Slytherin")).toBe(0);
    expect(service.getPoints("Ravenclaw")).toBe(0);
    expect(service.getPoints("Hufflepuff")).toBe(0);
  });

  it("should add points to a house", () => {
    expect(service.addPoints("Gryffindor", 20)).toBe(20);
    expect(service.getPoints("Gryffindor")).toBe(20);
  });

  it("should remove points from a house", () => {
    service.addPoints("Slytherin", 30);

    expect(service.removePoints("Slytherin", 10)).toBe(20);
  });

  it("should reject zero or negative points", () => {
    expect(() => service.addPoints("Gryffindor", 0))
      .toThrow("Points amount must be a positive integer");

    expect(() => service.addPoints("Gryffindor", -5))
      .toThrow("Points amount must be a positive integer");
  });

  it("should reject decimal points", () => {
    expect(() => service.addPoints("Ravenclaw", 2.5))
      .toThrow("Points amount must be a positive integer");
  });

  it("should reject removing more points than available", () => {
    service.addPoints("Hufflepuff", 10);

    expect(() => service.removePoints("Hufflepuff", 15))
      .toThrow("Insufficient house points");

    expect(service.getPoints("Hufflepuff")).toBe(10);
  });

  it("should return houses ranked by points", () => {
    service.addPoints("Gryffindor", 50);
    service.addPoints("Slytherin", 30);
    service.addPoints("Ravenclaw", 70);
    service.addPoints("Hufflepuff", 20);

    expect(service.getRanking()).toEqual([
      { house: "Ravenclaw", points: 70 },
      { house: "Gryffindor", points: 50 },
      { house: "Slytherin", points: 30 },
      { house: "Hufflepuff", points: 20 }
    ]);
  });

  it("should not modify the ranking when points are retrieved", () => {
    service.addPoints("Gryffindor", 40);

    service.getRanking();

    expect(service.getPoints("Gryffindor")).toBe(40);
  });
});
