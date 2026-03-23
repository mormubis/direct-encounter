# Direct Encounter

[![npm](https://img.shields.io/npm/v/@echecs/direct-encounter)](https://www.npmjs.com/package/@echecs/direct-encounter)
[![Test](https://github.com/mormubis/direct-encounter/actions/workflows/test.yml/badge.svg)](https://github.com/mormubis/direct-encounter/actions/workflows/test.yml)
[![Coverage](https://codecov.io/gh/mormubis/direct-encounter/branch/main/graph/badge.svg)](https://codecov.io/gh/mormubis/direct-encounter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Direct Encounter** is a TypeScript library implementing the Direct Encounter
tiebreak for chess tournaments, following the
[FIDE Tiebreak Regulations](https://handbook.fide.com/chapter/TieBreakRegulations032026)
(section 6). Zero runtime dependencies.

## Installation

```bash
npm install @echecs/direct-encounter
```

## Quick Start

```typescript
import { directEncounter } from '@echecs/direct-encounter';

// Players A, B, C are tied on points
const players = [{ id: 'A' }, { id: 'B' }, { id: 'C' }];
const games = [
  { blackId: 'B', result: 1, round: 1, whiteId: 'A' },
  { blackId: 'C', result: 0.5, round: 2, whiteId: 'A' },
  { blackId: 'C', result: 0, round: 3, whiteId: 'B' },
];

const score = directEncounter('A', games, players);
// Returns A's score from games played against other tied players (B and C)
```

## API

### `directEncounter(playerId, games, players)`

**FIDE section 6** — Direct Encounter score. Returns the total points scored by
`playerId` in games played only against other players in the `players` array
(the tied group). The caller is responsible for passing the correct subset of
`players` — typically those who share the same tournament score as `playerId`.
Byes are excluded.

```typescript
directEncounter(playerId: string, games: Game[], players: Player[]): number
```

When all tied players have identical Direct Encounter scores (the common case in
Swiss), this tiebreak is inconclusive and the next tiebreak in the ordering
should be applied.

## Contributing

Contributions are welcome. Please open an issue at
[github.com/mormubis/direct-encounter/issues](https://github.com/mormubis/direct-encounter/issues).
