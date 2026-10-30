# Hogwarts Academy — TypeScript Mini Project

A terminal-based TypeScript project inspired by Hogwarts Academy, designed to practice and demonstrate advanced TypeScript concepts.

## Features

- Generic repositories with constraints.
- Create wizards with automatically generated IDs.
- Find and filter wizards by house.
- Update wizard information.
- Manage spells with spell-power validation.
- Type guards to validate houses and wizard objects.
- Discriminated unions for academy events.
- Instance-based method caching.
- Method decorators for logging, execution-time measurement, validation, and caching.

## TypeScript Concepts

- Generics and generic constraints
- Utility types: `Pick`, `Omit`, `Partial`, `Record`, `Parameters`, `ReturnType`, `Extract`, `Exclude`
- Conditional types and `infer`
- Index signatures
- Type guards and discriminated unions
- Legacy TypeScript method decorators (`target`, `propertyKey`, `descriptor`)

## Requirements

- Node.js 18+ recommended
- npm

## Setup

```bash
npm install
```

## Run

```bash
npm start
```

## Type-check

```bash
npm run typecheck
```

## Note about Decorators

This project intentionally uses the legacy TypeScript decorator API to demonstrate the three method-decorator arguments: `target`, `propertyKey`, and `descriptor`.

The project enables `experimentalDecorators` in `tsconfig.json`.