import { gamesForPlayer, score } from './utilities.js';

import type { Game, Player } from './types.js';

function directEncounter(
  player: string,
  games: Game[][],
  players: Player[],
): number {
  const playerScore = score(player, games);
  const tiedPlayerIds = new Set(
    players
      .filter((p) => p.id !== player && score(p.id, games) === playerScore)
      .map((p) => p.id),
  );

  let sum = 0;
  for (const g of gamesForPlayer(player, games)) {
    if (g.black === g.white) {
      continue;
    }
    const opponent = g.white === player ? g.black : g.white;
    if (tiedPlayerIds.has(opponent)) {
      sum += g.white === player ? g.result : 1 - g.result;
    }
  }
  return sum;
}

export { directEncounter, directEncounter as tiebreak };

export type { Game, GameKind, Player, Result } from './types.js';
