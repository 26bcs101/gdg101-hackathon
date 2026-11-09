import { buildIsland } from '@engine/world/terrain.js';
import { buildForest } from '@engine/world/landscape.js';
import { ISLAND, TREES } from './layout.js';
import { buildStructures } from './structures.js';

export function build({ grid, layer }) {
  // Preserve landscape terrain without alterations
  buildIsland(grid, ISLAND, { surfaceAt: () => 'grass', corner: 10, wobble: 0 });
  const forest = buildForest(grid, layer, TREES);
  const structs = buildStructures({ layer });

  // Invisible border about 50 blocks above the island and along the edges up to 50 height
  const borders = {
    levels(x, z, out) {},
    collides(x, feet, z) {
      // Top ceiling: 50 blocks above the island
      if (feet + 1.8 >= 50) return true;
      // Edge borders along the perimeter up to 50 height
      if (feet < 50 && feet >= -10) {
        if (x <= ISLAND.x0 + 0.3 || x >= ISLAND.x1 - 0.3) return true;
        if (z <= ISLAND.z0 + 0.3 || z >= ISLAND.z1 - 0.3) return true;
      }
      return false;
    },
    obstructed(x, z, y) {
      if (y < 50 && y >= -10) {
        if (x <= ISLAND.x0 + 0.3 || x >= ISLAND.x1 - 0.3) return true;
        if (z <= ISLAND.z0 + 0.3 || z >= ISLAND.z1 - 0.3) return true;
      }
      return false;
    },
    pick() { return null; },
    ladderAt() { return null; },
    spots() { return []; },
  };

  return {
    batches: structs.batches,
        obstacles: structs.obstacles,
    hotspots: structs.hotspots,
    bakes: structs.bakes,
    forest,
    sites: [borders],
  };
}

export function setup({ player }) {
  // Ensure BetterMapIt and Homecraft badge buttons are removed from the radar
  document.querySelectorAll('#minimap .badge, #minimap .badge.credit, #minimap .badge.made, a.badge').forEach(el => el.remove());

  return {
    update(dt) {
      if (!player) return;
      // Safety bounds clamp to keep player within island perimeter
      const minX = ISLAND.x0 + 0.5, maxX = ISLAND.x1 - 0.5;
      const minZ = ISLAND.z0 + 0.5, maxZ = ISLAND.z1 - 0.5;
      if (player.pos.x < minX) player.pos.x = minX;
      else if (player.pos.x > maxX) player.pos.x = maxX;
      if (player.pos.z < minZ) player.pos.z = minZ;
      else if (player.pos.z > maxZ) player.pos.z = maxZ;
    }
  };
}
