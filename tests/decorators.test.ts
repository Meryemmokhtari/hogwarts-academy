import { describe, it, expect, vi, afterEach } from "vitest";
import { Cache } from "../src/decorators";

class TestService {
  calls = 0;

  getData(id: number): string {
    this.calls++;
    return `Data ${id}`;
  }
}

// Apply Cache decorator manually.
const descriptor = Object.getOwnPropertyDescriptor(
  TestService.prototype,
  "getData"
)!;

Cache(TestService.prototype, "getData", descriptor);

Object.defineProperty(
  TestService.prototype,
  "getData",
  descriptor
);

describe("Cache decorator", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should cache the result for the same arguments", () => {
    const service = new TestService();
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const firstResult = service.getData(1);
    const secondResult = service.getData(1);

    expect(firstResult).toBe("Data 1");
    expect(secondResult).toBe("Data 1");
    expect(service.calls).toBe(1);
    expect(consoleSpy).toHaveBeenCalledWith("[CACHE MISS] getData");
    expect(consoleSpy).toHaveBeenCalledWith("[CACHE HIT] getData");
  });

  it("should execute the method for different arguments", () => {
    const service = new TestService();

    service.getData(1);
    service.getData(2);

    expect(service.calls).toBe(2);
  });

  it("should keep separate caches for different instances", () => {
    const firstService = new TestService();
    const secondService = new TestService();

    firstService.getData(1);
    firstService.getData(1);
    secondService.getData(1);

    expect(firstService.calls).toBe(1);
    expect(secondService.calls).toBe(1);
  });
});