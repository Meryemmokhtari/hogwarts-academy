/**
 * Legacy TypeScript method decorator.
 * Enable "experimentalDecorators": true in tsconfig.json.
 */
import type { Spell } from "./types";

export function Log(
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): void {
  const originalMethod = descriptor.value as (
    ...args: unknown[]
  ) => unknown;

  descriptor.value = function (
    this: unknown,
    ...args: unknown[]
  ): unknown {
    console.log(`[CALL] ${String(propertyKey)}`, args);

    try {
      const result = originalMethod.apply(this, args);
      console.log(`[RETURN] ${String(propertyKey)}`, result);
      return result;
    } catch (error: unknown) {
      console.error(`[ERROR] ${String(propertyKey)}`, error);
      throw error;
    }
  };
}

export function MeasureTime(
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): void {
  const originalMethod = descriptor.value as (
    ...args: unknown[]
  ) => unknown;

  descriptor.value = function (
    this: unknown,
    ...args: unknown[]
  ): unknown {
    const start = Date.now();

    try {
      return originalMethod.apply(this, args);
    } finally {
      console.log(
        `[TIME] ${String(propertyKey)}: ${Date.now() - start} ms`
      );
    }
  };
}

export function ValidateSpellPower(
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): void {
  const originalMethod = descriptor.value as (
    ...args: unknown[]
  ) => unknown;

  descriptor.value = function (
    this: unknown,
    ...args: unknown[]
  ): unknown {
    const spell = args[0] as Spell;

    if (spell.power < 0) {
      throw new Error(
        `Invalid spell power: ${spell.power}. Power cannot be negative.`
      );
    }

    return originalMethod.apply(this, args);
  };
}

/**
 * Cache decorator: stores method results separately for each instance.
 */
export function Cache(
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): void {
  const originalMethod = descriptor.value as (
    ...args: unknown[]
  ) => unknown;

  const instanceCaches = new WeakMap<object, Map<string, unknown>>();

  descriptor.value = function (
    this: object,
    ...args: unknown[]
  ): unknown {
    let cacheKey: string;

    try {
      cacheKey = JSON.stringify(args) ?? String(args);
    } catch {
      return originalMethod.apply(this, args);
    }

    let instanceCache = instanceCaches.get(this);

    if (!instanceCache) {
      instanceCache = new Map<string, unknown>();
      instanceCaches.set(this, instanceCache);
    }

    if (instanceCache.has(cacheKey)) {
      console.log(`[CACHE HIT] ${String(propertyKey)}`);
      return instanceCache.get(cacheKey);
    }

    console.log(`[CACHE MISS] ${String(propertyKey)}`);

    const result = originalMethod.apply(this, args);
    instanceCache.set(cacheKey, result);

    return result;
  };
}
