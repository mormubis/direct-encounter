# AGENTS.md

Agent guidance for the `@echecs/direct-encounter` repository — a TypeScript
library implementing the Direct Encounter tiebreak following FIDE Tiebreak
Regulations (section 6).

**See also:** [`REFERENCES.md`](REFERENCES.md) | [`SPEC.md`](SPEC.md)

See the root `AGENTS.md` for workspace-wide conventions.

**Backlog:** tracked in
[GitHub Issues](https://github.com/mormubis/direct-encounter/issues).

---

## Project Overview

Pure calculation library, no runtime dependencies. Exports one function:

| Function          | Description                                     |
| ----------------- | ----------------------------------------------- |
| `directEncounter` | Score among the tied players' mutual games only |

The function conforms to the signature:

```ts
(playerId: string, games: Game[][], players?: Player[]) => number;
```

`Game[][]` is a round-indexed structure: `games[0]` contains round-1 games,
`games[1]` contains round-2 games, and so on. The `Game` type no longer has a
`round` field — round is determined by array position.

The `Game` type carries an optional `kind?: GameKind` field. When present it
identifies the nature of an unplayed round (e.g. `'half-bye'`, `'full-bye'`,
`'forfeit-win'`, `'forfeit-loss'`, `'zero-bye'`, `'pairing-bye'`). When absent,
the game is treated as a normal over-the-board result.

FIDE reference: https://handbook.fide.com/chapter/TieBreakRegulations032026
(section 6 — Direct Encounter)

All source lives in `src/index.ts`; tests in `src/__tests__/index.spec.ts`.

---

## Commands

### Build

```bash
pnpm run build          # bundle TypeScript → dist/ via tsdown
```

### Test

```bash
pnpm run test                          # run all tests once
pnpm run test:watch                    # watch mode
pnpm run test:coverage                 # with coverage report

# Run a single test file
pnpm run test src/__tests__/index.spec.ts

# Run a single test by name (substring match)
pnpm run test -- --reporter=verbose -t "directEncounter"
```

### Lint & Format

```bash
pnpm run lint           # ESLint + tsc type-check (auto-fixes style issues)
pnpm run lint:ci        # strict — zero warnings allowed, no auto-fix
pnpm run lint:style     # ESLint only (auto-fixes)
pnpm run lint:types     # tsc --noEmit type-check only
pnpm run format         # Prettier (writes changes)
pnpm run format:ci      # Prettier check only (no writes)
```

### Full pre-PR check

```bash
pnpm lint && pnpm test && pnpm build
```

---

## Architecture Notes

- Direct Encounter considers only the games played **among the group of tied
  players**, not the full tournament. The caller is responsible for passing the
  correct subset of `players` (those who share the same score) so the function
  can filter `games` accordingly.
- The function sums the points scored by `playerId` in games where both
  participants are members of the `players` array.
- A `Game` with `black: ''` (empty string) represents a **bye**. Byes are
  excluded from Direct Encounter calculations — there is no real opponent.
- When all tied players have identical Direct Encounter scores (which is the
  common case in Swiss), this tiebreak is inconclusive and the next tiebreak in
  the ordering is applied by the caller.
- **No runtime dependencies** — keep it that way.
- **ESM-only** — the package ships only ESM. Do not add a CJS build.

---

## Tiebreak Signature

All tiebreak functions consumed by `@echecs/tournament` must conform to:

```typescript
(playerId: string, games: Game[], players: Map<string, Player>) => number;
```

---

## Validation

Input validation is provided by TypeScript's strict type system at compile time.
There is no runtime validation library. Do not add runtime type-checking guards
unless there is an explicit trust boundary (user-supplied strings, external
data).

---

## Error Handling

The function is a pure calculation and does not throw. An empty game list
returns `0` rather than throwing.
