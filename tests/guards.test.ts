import { describe, it, expect } from "vitest";
import { isHouse, isWizard } from "../src/guards";

describe("isHouse", () => {
  it("should accept a valid house", () => {
    expect(isHouse("Gryffindor")).toBe(true);
  });

  it("should reject an invalid house", () => {
    expect(isHouse("Beauxbatons")).toBe(false);
  });
});

describe("isWizard", () => {
  it("should accept a valid wizard", () => {
    const wizard = {
      id: 1,
      name: "Harry Potter",
      house: "Gryffindor",
      level: 5,
      active: true
    };

    expect(isWizard(wizard)).toBe(true);
  });

  it("should reject a wizard with an invalid house", () => {
    const wizard = {
      id: 2,
      name: "Pansy Parkinson",
      house: "Beauxbatons",
      level: 3,
      active: true
    };

    expect(isWizard(wizard)).toBe(false);
  });

  it("should reject null", () => {
    expect(isWizard(null)).toBe(false);
  });

  it("should reject incomplete wizard data", () => {
    const wizard = {
      id: 3,
      name: "Neville"
    };

    expect(isWizard(wizard)).toBe(false);
  });
});