// The ground plan and everything on it that is not a station: paths, the
// plaza with its maze inlay, lamp posts, flowers and the GDG signboard.
// Paths are the island's own top blocks, so they cost no extra draw calls.
import * as THREE from 'three';
import { inRect } from '@engine/world/terrain.js';
import { buildTufts } from '@engine/world/landscape.js';
import { rng } from '@engine/world/textures.js';
import { M } from './kit.js';
import { FACING } from './frame.js';
import { PLAN, RING, AVENUE, MAZE, LAMPS, TREES, SIGNBOARD } from './layout.js';

// ---------- Maze inlay ----------
// A perfect maze (one route between any two cells), carved with a seeded
// depth-first search so it is the same on every visit. Walls are 1 block.
function carveMaze({ x0, x1, z0, z1, seed }) {
  const W = x1 - x0, H = z1 - z0, cw = (W - 1) / 2, ch = (H - 1) / 2;
  const open = new Uint8Array(W * H), seen = new Uint8Array(cw * ch), r = rng(seed);
  const cell = (i, j) => { open[(1 + 2 * i) + (1 + 2 * j) * W] = 1; };
  const stack = [[Math.floor(cw / 2), ch - 1]];
  seen[stack[0][0] + stack[0][1] * cw] = 1; cell(...stack[0]);
  while (stack.length) {
    const [i, j] = stack[stack.length - 1];
    const next = [[1, 0], [-1, 0], [0, 1], [0, -1]]
      .map(([di, dj]) => [i + di, j + dj, di, dj])
      .filter(([a, b]) => a >= 0 && b >= 0 && a < cw && b < ch && !seen[a + b * cw]);
    if (!next.length) { stack.pop(); continue; }
    const [a, b, di, dj] = next[Math.floor(r() * next.length)];
    seen[a + b * cw] = 1; cell(a, b);
    open[(1 + 2 * i + di) + (1 + 2 * j + dj) * W] = 1;
    stack.push([a, b]);
  }
  // Doors in the middle of the south and north sides.
  const mid = Math.floor(W / 2);
  open[mid + (H - 1) * W] = 1; open[mid] = 1;
  return (x, z) => !!open[(x - x0) + (z - z0) * W];
}
const mazeOpen = carveMaze(MAZE);

// ---------- Walkways from the ring to each station ----------
// A 2 m strip from just in front of the station out to the ring or avenue.
const walkways = PLAN.map(p => {
  const yaw = FACING[p.face], fx = Math.sin(yaw), fz = Math.cos(yaw);
  return (cx, cz) => {
    const dx = cx - p.x, dz = cz - p.z, along = dx * fx + dz * fz, across = Math.abs(dx * fz - dz * fx);
    return along > 1.0 && along < 4.6 && across < 1.0;
  };
});
const onWalkway = (x, z) => walkways.some(w => w(x + 0.5, z + 0.5));

// What the top block of the island is at (x, z): see buildIsland's surfaceAt.
export function surfaceAt(x, z) {
  if (inRect(MAZE, x, z)) return mazeOpen(x, z) ? 'travertine' : 'hedge';
  if (inRect(RING.inner, x, z)) return 'travertine';
  if (inRect(RING.outer, x, z) || inRect(AVENUE, x, z) || onWalkway(x, z)) return 'pavers';
  return 'grass';
}

// ---------- Decoration ----------
export function buildDecor({ B, layer, materials, obstacles, bakes, planes }) {
  // Lamp posts: a black post with a lantern; their light is baked for the night.
  LAMPS.forEach(([x, z], i) => {
    B.box(x, 0, z, 0.3, 0.2, 0.3, M.stone);
    B.box(x, 0.2, z, 0.12, 2.5, 0.12, M.blackMetal);
    B.box(x, 2.7, z, 0.34, 0.06, 0.34, M.blackMetal);
    B.box(x, 2.76, z, 0.24, 0.3, 0.24, M.lanternGlow);
    B.box(x, 3.06, z, 0.34, 0.08, 0.34, M.blackMetal);
    obstacles.push({ x0: x - 0.2, x1: x + 0.2, z0: z - 0.2, z1: z + 0.2, level: 0 });
    bakes.push({ id: `lamp-${i}`, position: [x, 2.9, z], power: 2.2, radius: 8, direction: null });
  });

  // Grass and flowers on open lawn, away from paths, stations and trees.
  const r = rng(2026), tufts = [];
  const clear = (x, z) => surfaceAt(Math.floor(x), Math.floor(z)) === 'grass'
    && !PLAN.some(p => Math.hypot(x - p.x, z - p.z) < 3.2)
    && !TREES.some(([tx, tz]) => Math.hypot(x - tx, z - tz) < 3)
    && !LAMPS.some(([lx, lz]) => Math.hypot(x - lx, z - lz) < 0.8)
    && x > -22 && x < 22 && z > -23 && z < 26;
  const tiles = ['tall_grass', 'tall_grass', 'tall_grass', 'flower_red', 'flower_white', 'flower_violet'];
  for (let n = 0; n < 900 && tufts.length < 170; n++) {
    const x = -22 + r() * 44, z = -23 + r() * 49;
    if (!clear(x, z)) continue;
    const tile = tiles[Math.floor(r() * tiles.length)];
    tufts.push({ x, z, tile, s: tile === 'tall_grass' ? 0.4 + r() * 0.25 : 0.45 + r() * 0.15 });
  }
  planes.push(buildTufts(layer, materials, tufts));

  buildSignboard({ B, obstacles, bakes, planes }, SIGNBOARD.x, SIGNBOARD.z);
}

// The GDG signboard: the poster on both faces of a timber block, facing south.
function buildSignboard({ B, obstacles, bakes, planes }, x, z) {
  const texture = new THREE.TextureLoader().load('assets/gdg-signboard.webp');
  texture.colorSpace = THREE.SRGBColorSpace;
  const boardW = 6.6, boardH = 4.2, half = 0.46;
  const geometry = new THREE.PlaneGeometry(boardW, boardH);
  const material = new THREE.MeshLambertMaterial({ map: texture, transparent: true, alphaTest: 0.25 });
  const front = new THREE.Mesh(geometry, material);
  front.position.set(x, boardH / 2, z + half);
  const back = new THREE.Mesh(geometry, material);
  back.position.set(x, boardH / 2, z - half);
  back.rotation.y = Math.PI;
  planes.push(front, back);

  B.box(x, 0, z, 5.8, 0.35, 0.92, M.stone);
  B.box(x, 0.35, z, 5.6, 2.7, 0.88, { tex: 'wood_panel', top: 'oak' });
  B.box(x, 3.05, z, 5.7, 0.15, 0.9, M.oak);
  obstacles.push({ x0: x - 3.4, x1: x + 3.4, z0: z - 0.55, z1: z + 0.55, level: 0 });
  bakes.push(
    { id: 'board-w', position: [x - 2.8, 2.3, z + 0.8], power: 2.2, radius: 6, direction: null },
    { id: 'board-e', position: [x + 2.7, 2.2, z + 0.8], power: 2.2, radius: 6, direction: null },
  );
}
