import { buildIsland } from '@engine/world/terrain.js';
import { buildForest } from '@engine/world/landscape.js';
import { ISLAND, TREES } from './layout.js';
import { buildStructures } from './structures.js';

export function build({ grid, layer }) {
  buildIsland(grid, ISLAND, { surfaceAt: () => 'grass', corner: 10, wobble: 0 });
  const forest = buildForest(grid, layer, TREES);
  const structs = buildStructures({ layer });

  return {
    batches: structs.batches,
    obstacles: structs.obstacles,
    hotspots: structs.hotspots,
    bakes: structs.bakes,
    forest,
  };
}

export function setup({ player }) {
  return {};
}
