import { describe, expect, it } from 'vitest';

import { directEncounter } from '../functions.js';

import type { Game, Player } from '../types.js';

// 4 players, 3 rounds:
// Round 1: A(W) 1-0 B, C(W) 0-1 D
// Round 2: A(W) 0.5-0.5 D, C(W) 0-1 B
// Round 3: A(W) 1-0 C, D(W) 1-0 B
// Scores: A=2.5, D=2.5, B=1, C=0
const PLAYERS: Player[] = [{ id: 'A' }, { id: 'B' }, { id: 'C' }, { id: 'D' }];

const GAMES: Game[][] = [
  [
    { black: 'B', result: 1, white: 'A' },
    { black: 'D', result: 0, white: 'C' },
  ],
  [
    { black: 'D', result: 0.5, white: 'A' },
    { black: 'B', result: 0, white: 'C' },
  ],
  [
    { black: 'C', result: 1, white: 'A' },
    { black: 'B', result: 1, white: 'D' },
  ],
];

describe('directEncounter', () => {
  it('returns points scored against tied players only', () => {
    // A(2.5) is tied with D(2.5); A drew D → 0.5
    expect(directEncounter('A', GAMES, PLAYERS)).toBe(0.5);
  });

  it('returns 0 when no one is tied with the player', () => {
    // B(1) is unique → 0
    expect(directEncounter('B', GAMES, PLAYERS)).toBe(0);
  });

  it('handles player with no games', () => {
    expect(directEncounter('A', [], PLAYERS)).toBe(0);
  });
});
