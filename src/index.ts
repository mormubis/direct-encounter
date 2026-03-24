import { BYE_SENTINEL, gamesForPlayer, score } from './utilities.js';

import type { Game, Player } from './types.js';

function directEncounter(
  playerId: string,
  games: Game[][],
  players: Player[],
): number {
  const playerScore = score(playerId, games);
  const tiedPlayerIds = new Set(
    players
      .filter((p) => p.id !== playerId && score(p.id, games) === playerScore)
      .map((p) => p.id),
  );

  let sum = 0;
  for (const g of gamesForPlayer(playerId, games)) {
    if (g.black === BYE_SENTINEL || g.white === BYE_SENTINEL) {
      continue;
    }
    const opponentId = g.white === playerId ? g.black : g.white;
    if (tiedPlayerIds.has(opponentId)) {
      sum += g.white === playerId ? g.result : 1 - g.result;
    }
  }
  return sum;
}

export { directEncounter };

export type { Game, Player, Result } from './types.js';
