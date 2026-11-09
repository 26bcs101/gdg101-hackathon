// Procedural 3D structures for Labyrinth hackathon Organised by GDG NIT Hamirpur.
// Built with BoxBatch for high-performance batched rendering within budget.
import * as THREE from 'three';
import { BoxBatch } from '@engine/world/blocks.js';
import { canvasTexture } from '@engine/world/textures.js';

// Texture lookups conforming to Homecraft's procedural 16×16 texture atlas.
const L = {
  oak: { tex: 'oak' },
  wood: { tex: 'wood_panel' },
  deck: { tex: 'deck' },
  log: { tex: 'log', top: 'log_top' },
  stone: { tex: 'stone' },
  deepslate: { tex: 'deepslate' },
  concrete: { tex: 'concrete' },
  pavers: { tex: 'pavers' },
  travertine: { tex: 'travertine' },
  books: { tex: 'bookshelf', top: 'wood_panel' },
  steel: { tex: 'steel' },
  blackMetal: { tex: 'black_metal' },
  gold: { tex: 'paint', tint: 0xf1c40f },
  goldGlow: { tex: 'paint', tint: 0xf39c12, emissive: 0.6 },
  diamond: { tex: 'paint', tint: 0x00cec9, emissive: 0.5 },
  emerald: { tex: 'paint', tint: 0x2ecc71, emissive: 0.7 },
  lapis: { tex: 'paint', tint: 0x0984e3 },
  obsidian: { tex: 'paint', tint: 0x19142b },
  redVelvet: { tex: 'velvet', tint: 0xb71540 },
  paper: { tex: 'paint', tint: 0xfffbe6 },
  fireGlow: { tex: 'paint', tint: 0xff7700, emissive: 1 },
  lanternGlow: { tex: 'paint', tint: 0xffb142, emissive: 1 },
  beaconGlow: { tex: 'paint', tint: 0x74b9ff, emissive: 1 },
  purplePortal: { tex: 'paint', tint: 0x8e44ad, emissive: 0.95 },
  paint: tint => ({ tex: 'paint', tint }),
  light: (tint, emissive = 1) => ({ tex: 'paint', tint, emissive }),
};

export function buildStructures({ layer }) {
  const B = new BoxBatch(layer);
  const planes = [];
  const obstacles = [];
  const hotspots = [];
  const bakes = [];

  const foot = (x, z, w, d, level = 0) => {
    obstacles.push({ x0: x - w / 2, x1: x + w / 2, z0: z - d / 2, z1: z + d / 2, level });
  };

  const hot = (id, x, y, z, w, h, d) => {
    hotspots.push({
      id,
      box: new THREE.Box3(
        new THREE.Vector3(x - w / 2, y, z - d / 2),
        new THREE.Vector3(x + w / 2, y + h, z + d / 2)
      ),
    });
  };

  const bake = (id, x, y, z, power, radius, direction = null) => {
    bakes.push({ id, position: [x, y, z], power, radius, direction });
  };

  // -------------------------------------------------------------------------
  // 1. Welcome Outpost (Visitor Information Desk)
  // -------------------------------------------------------------------------
  function buildWelcome(x, z) {
    B.at(x, 0, z, 0, () => {
      // 4 Oak Log Corner Pillars
      for (const px of [-1.1, 1.1]) {
        for (const pz of [-0.9, 0.9]) {
          B.box(px, 0, pz, 0.28, 2.3, 0.28, L.log);
        }
      }
      // Roof crossbeams
      B.box(0, 2.2, -0.9, 2.5, 0.18, 0.2, L.wood);
      B.box(0, 2.2, 0.9, 2.5, 0.18, 0.2, L.wood);
      B.box(-1.1, 2.2, 0, 0.2, 0.18, 1.9, L.wood);
      B.box(1.1, 2.2, 0, 0.2, 0.18, 1.9, L.wood);

      // Pitched timber awning roof
      B.box(0, 2.35, 0, 2.7, 0.15, 2.3, L.oak);
      B.box(0, 2.45, 0, 2.3, 0.12, 1.9, L.wood);

      // Crimson front awning fringe
      B.box(0, 2.22, 1.1, 2.7, 0.16, 0.08, L.redVelvet);

      // Oak Reception Counter Desk
      B.box(0, 0, 0.1, 1.6, 0.85, 0.65, L.oak);
      B.box(0, 0.85, 0.1, 1.7, 0.08, 0.75, L.wood);

      // Open Quest Book on counter
      B.box(-0.35, 0.93, 0.1, 0.42, 0.03, 0.32, L.wood);
      B.box(-0.45, 0.95, 0.1, 0.2, 0.02, 0.3, L.paper);
      B.box(-0.25, 0.95, 0.1, 0.2, 0.02, 0.3, L.paper);

      // Inkwell & Quill
      B.box(0.35, 0.93, 0.15, 0.08, 0.09, 0.08, L.blackMetal);
      B.box(0.36, 1.02, 0.16, 0.03, 0.16, 0.03, L.paper);

      // Hanging Lantern from roof center
      B.box(0, 2.05, 0, 0.04, 0.3, 0.04, L.steel);
      B.box(0, 1.82, 0, 0.22, 0.25, 0.22, L.blackMetal);
      B.box(0, 1.84, 0, 0.16, 0.18, 0.16, L.lanternGlow);

      // Directional Wooden Signpost
      B.box(1.3, 0, 1.1, 0.12, 1.25, 0.12, L.log);
      B.box(1.05, 1.05, 1.1, 0.55, 0.18, 0.04, L.wood);
      B.box(1.5, 0.78, 1.1, 0.5, 0.16, 0.04, L.wood);
    });

    foot(x, z + 0.1, 1.7, 0.8);
    hot('welcome', x, 0, z, 2.8, 2.5, 2.5);
    bake('welcome-lantern', x, 1.9, z, 2.4, 9, [0, -1, 0]);
  }

  // -------------------------------------------------------------------------
  // 2. Blacksmith Workshop (Tracks & Armory)
  // -------------------------------------------------------------------------
  function buildTracks(x, z) {
    B.at(x, 0, z, 0, () => {
      // Cobblestone / Deepslate Blast Furnace Hearth
      B.box(0, 0, -0.6, 1.5, 1.6, 1.4, L.deepslate);
      B.box(0, 1.6, -0.6, 0.75, 1.0, 0.75, L.stone);

      // Glowing Fire Chamber
      B.box(0, 0.35, 0.12, 0.75, 0.55, 0.08, L.fireGlow);

      // Solid Iron Anvil on Oak Stump
      B.box(-0.85, 0, 0.5, 0.55, 0.45, 0.55, L.log);
      B.box(-0.85, 0.45, 0.5, 0.45, 0.1, 0.28, L.blackMetal);
      B.box(-0.85, 0.55, 0.5, 0.2, 0.15, 0.16, L.blackMetal);
      B.box(-0.9, 0.7, 0.5, 0.55, 0.15, 0.26, L.steel);

      // Armor Stand with Diamond Suit
      B.box(0.85, 0, 0.5, 0.55, 0.08, 0.55, L.stone);
      B.box(0.85, 0.08, 0.5, 0.08, 1.1, 0.08, L.wood);
      B.box(0.85, 0.7, 0.5, 0.48, 0.58, 0.26, L.diamond);
      B.box(0.85, 1.25, 0.5, 0.36, 0.32, 0.36, L.diamond);
    });

    foot(x, z - 0.6, 1.6, 1.5);
    foot(x - 0.85, z + 0.5, 0.65, 0.65);
    foot(x + 0.85, z + 0.5, 0.65, 0.65);
    hot('tracks', x, 0, z, 3.2, 2.5, 3.2);
    bake('tracks-furnace', x, 0.6, z + 0.3, 2.8, 10, [0, 0, 1]);
  }

  // -------------------------------------------------------------------------
  // 3. Clocktower Pavilion (Schedule Timeline)
  // -------------------------------------------------------------------------
  function buildSchedule(x, z) {
    B.at(x, 0, z, 0, () => {
      // Stone paver platform
      B.box(0, 0, 0, 2.6, 0.35, 2.6, L.pavers);

      // 4 Corner Timber Pillars
      for (const px of [-0.95, 0.95]) {
        for (const pz of [-0.95, 0.95]) {
          B.box(px, 0.35, pz, 0.28, 2.4, 0.28, L.log);
        }
      }

      // Upper Clock Housing
      B.box(0, 2.75, 0, 2.2, 1.25, 2.2, L.wood);

      // Pyramidal Roof Top
      B.box(0, 4.0, 0, 2.5, 0.2, 2.5, L.oak);
      B.box(0, 4.2, 0, 1.9, 0.25, 1.9, L.oak);
      B.box(0, 4.45, 0, 1.3, 0.25, 1.3, L.oak);
      B.box(0, 4.7, 0, 0.7, 0.3, 0.7, L.oak);

      // Gold Clock Face on Front
      B.box(0, 3.35, 1.12, 0.88, 0.88, 0.05, L.gold);
      B.box(0, 3.35, 1.15, 0.72, 0.72, 0.02, L.paper);
      // Clock hands
      B.box(0, 3.45, 1.17, 0.05, 0.2, 0.01, L.blackMetal);
      B.box(0.08, 3.35, 1.17, 0.16, 0.04, 0.01, L.paint(0xd23c3c));

      // Hanging Brass Bell in Pavilion
      B.box(0, 2.4, 0, 0.05, 0.35, 0.05, L.steel);
      B.box(0, 2.1, 0, 0.35, 0.32, 0.35, L.goldGlow);

      // Noticeboard / Timetable at Left
      B.box(-1.25, 0.35, 0, 0.08, 1.2, 1.0, L.wood);
      B.box(-1.2, 0.75, 0, 0.03, 0.65, 0.75, L.paper);
    });

    foot(x, z, 2.6, 2.6);
    hot('schedule', x, 0, z, 3.2, 3.5, 3.2);
    bake('schedule-bell', x, 2.2, z, 2.2, 9);
  }

  // -------------------------------------------------------------------------
  // 4. Treasure Vault (Prizes & Hall of Champions)
  // -------------------------------------------------------------------------
  function buildPrizes(x, z) {
    B.at(x, 0, z, 0, () => {
      // Stone Dais
      B.box(0, 0, 0, 2.8, 0.35, 2.8, L.deepslate);
      // Crimson Velvet Carpet Runner
      B.box(0, 0.35, 0, 1.4, 0.03, 2.7, L.redVelvet);

      // Central Gold Plinth
      B.box(0, 0.38, -0.4, 0.85, 0.65, 0.85, L.gold);

      // Championship Trophy Cup
      B.box(0, 1.03, -0.4, 0.3, 0.08, 0.3, L.gold);
      B.box(0, 1.11, -0.4, 0.12, 0.18, 0.12, L.gold);
      B.box(0, 1.29, -0.4, 0.42, 0.32, 0.42, L.goldGlow);
      // Floating Diamond Gem in Cup
      B.box(0, 1.45, -0.4, 0.18, 0.18, 0.18, L.diamond);

      // Double Treasure Chest
      B.box(0.85, 0.38, 0.4, 0.85, 0.45, 0.55, L.wood);
      B.box(0.85, 0.83, 0.4, 0.85, 0.14, 0.55, L.oak);
      B.box(0.85, 0.55, 0.69, 0.12, 0.14, 0.05, L.gold);

      // Glowing Emerald Display Pedestal
      B.box(-0.85, 0.38, 0.4, 0.55, 0.5, 0.55, L.obsidian);
      B.box(-0.85, 0.88, 0.4, 0.26, 0.26, 0.26, L.emerald);
    });

    foot(x, z, 2.8, 2.8);
    hot('prizes', x, 0, z, 3.4, 2.5, 3.4);
    bake('prizes-trophy', x, 1.4, z - 0.4, 2.5, 9);
    bake('prizes-chest', x + 0.85, 0.7, z + 0.4, 1.8, 6);
  }

  // -------------------------------------------------------------------------
  // 5. Tech Beacon Pavilion (Sponsors Ecosystem)
  // -------------------------------------------------------------------------
  function buildSponsors(x, z) {
    B.at(x, 0, z, 0, () => {
      // Polished Quartz Base Dais
      B.box(0, 0, 0, 2.8, 0.45, 2.8, L.travertine);
      // Lapis Lazuli Inlay Border
      B.box(0, 0.45, 0, 2.4, 0.02, 2.4, L.lapis);

      // 4 Quartz Corner Pillars
      for (const px of [-1.0, 1.0]) {
        for (const pz of [-1.0, 1.0]) {
          B.box(px, 0.47, pz, 0.32, 2.3, 0.32, L.concrete);
        }
      }

      // Quartz Arch Canopy
      B.box(0, 2.77, 0, 2.6, 0.25, 2.6, L.travertine);

      // Central Nether Beacon Base (Obsidian & Diamond Block)
      B.box(0, 0.47, 0, 0.9, 0.45, 0.9, L.obsidian);
      B.box(0, 0.92, 0, 0.55, 0.45, 0.55, L.diamond);

      // Vertical Sky Beam rising into clouds
      B.box(0, 1.37, 0, 0.28, 14.0, 0.28, L.beaconGlow);

      // Floating Holographic Ring around the beam
      B.box(0, 1.75, 0.65, 1.2, 0.08, 0.1, L.beaconGlow);
      B.box(0, 1.75, -0.65, 1.2, 0.08, 0.1, L.beaconGlow);
      B.box(0.65, 1.75, 0, 0.1, 0.08, 1.2, L.beaconGlow);
      B.box(-0.65, 1.75, 0, 0.1, 0.08, 1.2, L.beaconGlow);
    });

    foot(x, z, 2.8, 2.8);
    hot('sponsors', x, 0, z, 3.4, 3.0, 3.4);
    bake('beacon-light', x, 1.8, z, 3.5, 14);
  }

  // -------------------------------------------------------------------------
  // 6. Adventurer Campfire Circle (Team Crew Camp)
  // -------------------------------------------------------------------------
  function buildTeam(x, z) {
    B.at(x, 0, z, 0, () => {
      // Stone Firepit Ring
      B.box(0, 0, 0, 1.4, 0.2, 1.4, L.stone);
      // Dark Ash Bed
      B.box(0, 0.18, 0, 0.9, 0.05, 0.9, L.blackMetal);

      // Teepee Logs
      B.box(0.2, 0.23, 0.2, 0.14, 0.5, 0.14, L.log);
      B.box(-0.2, 0.23, -0.2, 0.14, 0.5, 0.14, L.log);
      B.box(-0.2, 0.23, 0.2, 0.14, 0.5, 0.14, L.log);
      B.box(0.2, 0.23, -0.2, 0.14, 0.5, 0.14, L.log);

      // Campfire Flame blocks
      B.box(0, 0.35, 0, 0.45, 0.55, 0.45, L.fireGlow);
      B.box(0, 0.45, 0, 0.25, 0.4, 0.25, L.paint(0xffeb3b));

      // 3 Split-Log Benches around the campfire
      // Bench North
      B.box(0, 0.25, -1.35, 1.2, 0.18, 0.4, L.oak);
      B.box(-0.45, 0, -1.35, 0.2, 0.25, 0.35, L.log);
      B.box(0.45, 0, -1.35, 0.2, 0.25, 0.35, L.log);

      // Bench West
      B.box(-1.35, 0.25, 0, 0.4, 0.18, 1.2, L.oak);
      B.box(-1.35, 0, -0.45, 0.35, 0.25, 0.2, L.log);
      B.box(-1.35, 0, 0.45, 0.35, 0.25, 0.2, L.log);

      // Bench East
      B.box(1.35, 0.25, 0, 0.4, 0.18, 1.2, L.oak);
      B.box(1.35, 0, -0.45, 0.35, 0.25, 0.2, L.log);
      B.box(1.35, 0, 0.45, 0.35, 0.25, 0.2, L.log);

      // Traveler Backpack & Bedroll
      B.box(1.2, 0.43, -0.4, 0.32, 0.38, 0.24, L.paint(0xc0392b));
      B.box(1.2, 0.65, -0.4, 0.38, 0.14, 0.18, L.paint(0x27ae60));
    });

    foot(x, z, 1.4, 1.4);
    foot(x, z - 1.35, 1.3, 0.5);
    foot(x - 1.35, z, 0.5, 1.3);
    foot(x + 1.35, z, 0.5, 1.3);
    hot('team', x, 0, z, 3.4, 2.0, 3.4);
    bake('team-campfire', x, 0.7, z, 2.8, 11);
  }

  // -------------------------------------------------------------------------
  // 7. Arcane Library (FAQ & Sanctum)
  // -------------------------------------------------------------------------
  function buildFaq(x, z) {
    B.at(x, 0, z, 0, () => {
      // Stone flagstone base
      B.box(0, 0, 0, 2.8, 0.35, 2.8, L.pavers);

      // 2 Towering Bookcases along back wall
      B.box(-0.85, 0.35, -0.9, 1.1, 2.0, 0.45, L.books);
      B.box(0.85, 0.35, -0.9, 1.1, 2.0, 0.45, L.books);

      // Central Obsidian & Diamond Enchanting Table
      B.box(0, 0.35, 0.1, 1.05, 0.22, 1.05, L.obsidian);
      B.box(0, 0.57, 0.1, 0.9, 0.15, 0.9, L.diamond);
      B.box(0, 0.72, 0.1, 1.0, 0.05, 1.0, L.redVelvet);

      // Floating Mystical Spellbook
      B.box(0, 0.92, 0.1, 0.42, 0.05, 0.32, L.paint(0x833471));
      B.box(-0.1, 0.96, 0.1, 0.18, 0.02, 0.3, L.paper);
      B.box(0.1, 0.96, 0.1, 0.18, 0.02, 0.3, L.paper);

      // Orbiting mystic crystal glyphs
      B.box(0.35, 1.15, 0.1, 0.08, 0.08, 0.08, L.paint(0xa55eea));
      B.box(-0.35, 1.1, 0.25, 0.07, 0.07, 0.07, L.paint(0x45aaf2));
      B.box(0.12, 1.25, -0.25, 0.08, 0.08, 0.08, L.paint(0xfd9644));
    });

    foot(x, z - 0.9, 2.6, 0.6);
    foot(x, z + 0.1, 1.1, 1.1);
    hot('faq', x, 0, z, 3.2, 2.8, 3.2);
    bake('library-sanctum', x, 1.3, z + 0.1, 2.5, 9);
  }

  // -------------------------------------------------------------------------
  // 8. Cartographer's Overlook (Venue & Navigation)
  // -------------------------------------------------------------------------
  function buildVenue(x, z) {
    B.at(x, 0, z, 0, () => {
      // Nautical Spruce Decking platform
      B.box(0, 0, 0, 2.8, 0.35, 2.8, L.deck);

      // Perimeter Timber Fences (along North and West)
      B.box(0, 0.35, -1.3, 2.7, 0.5, 0.08, L.log);
      B.box(-1.3, 0.35, 0, 0.08, 0.5, 2.7, L.log);

      // Cartographer's Drafting Table
      B.box(0.3, 0.35, -0.15, 1.3, 0.75, 0.85, L.wood);
      // Maps and nautical charts on table
      B.box(0.3, 1.1, -0.15, 1.0, 0.02, 0.65, L.paper);
      B.box(0.65, 1.12, 0.1, 0.25, 0.02, 0.2, L.lapis);

      // Brass Telescope on Tripod
      B.box(-0.7, 0.35, 0.6, 0.45, 0.85, 0.45, L.wood);
      B.box(-0.7, 1.2, 0.6, 0.65, 0.12, 0.12, L.gold);

      // Storage barrel & crate
      B.box(0.9, 0.35, 0.8, 0.55, 0.65, 0.55, L.log);
      B.box(-0.8, 0.35, -0.8, 0.5, 0.5, 0.5, L.oak);
    });

    foot(x, z, 2.8, 2.8);
    hot('venue', x, 0, z, 3.2, 2.2, 3.2);
    bake('venue-lantern', x + 0.3, 1.2, z - 0.15, 2.0, 8);
  }

  // -------------------------------------------------------------------------
  // 9. Nether Portal Arch & Registration Lectern
  // -------------------------------------------------------------------------
  function buildRegister(x, z) {
    B.at(x, 0, z, 0, () => {
      // 4×5 Obsidian Portal Frame
      // Base (4 blocks wide = 2.8 m)
      B.box(0, 0, 0, 2.8, 0.6, 0.7, L.obsidian);
      // Left & Right Pillars
      B.box(-1.1, 0.6, 0, 0.6, 2.4, 0.7, L.obsidian);
      B.box(1.1, 0.6, 0, 0.6, 2.4, 0.7, L.obsidian);
      // Top Lintel
      B.box(0, 3.0, 0, 2.8, 0.6, 0.7, L.obsidian);

      // Swirling Purple Nether Energy Vortex Interior
      B.box(0, 0.6, 0, 1.6, 2.4, 0.18, L.purplePortal);

      // Registration Lectern at Front
      B.box(0, 0, -1.3, 0.65, 0.85, 0.5, L.deepslate);
      B.box(0, 0.85, -1.3, 0.7, 0.08, 0.55, L.wood);
      // Open Registration ledger
      B.box(0, 0.93, -1.3, 0.45, 0.03, 0.35, L.paper);

      // Guide pillars with gold torches
      B.box(-1.6, 0, -0.8, 0.3, 0.8, 0.3, L.stone);
      B.box(-1.6, 0.8, -0.8, 0.12, 0.16, 0.12, L.fireGlow);

      B.box(1.6, 0, -0.8, 0.3, 0.8, 0.3, L.stone);
      B.box(1.6, 0.8, -0.8, 0.12, 0.16, 0.12, L.fireGlow);
    });

    foot(x, z, 3.0, 0.9);
    foot(x, z - 1.3, 0.7, 0.6);
    hot('register', x, 0, z, 3.4, 3.4, 3.4);
    bake('portal-vortex', x, 1.8, z, 3.2, 12);
  }

  // -------------------------------------------------------------------------
  // 10. Central GDG Monument Signboard (Voxel GDG Signboard Adventure)
  // -------------------------------------------------------------------------
  function buildGDGSignboard(x, z) {
    const loader = new THREE.TextureLoader();
    const texture = loader.load('assets/gdg-signboard.png');
    texture.colorSpace = THREE.SRGBColorSpace;

    // Bold poster dimensions: W = 7.6m, H = 4.3m (16:9 cinematic widescreen bold presence)
    const boardH = 4.3;
    const boardW = 7.6;
    const boardY = 2.15; // center at y=2.15 so bottom touches ground y=0
    const halfThick = 0.06; // clean 12cm depth

    const geom = new THREE.PlaneGeometry(boardW, boardH);
    const mat = new THREE.MeshLambertMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.25,
      depthWrite: true,
      side: THREE.FrontSide,
    });

    // Front Plane (facing South toward spawn at z = 16.5)
    const front = new THREE.Mesh(geom, mat);
    front.position.set(x, boardY, z + halfThick);
    front.rotation.set(0, 0, 0);
    planes.push(front);

    // Back Plane (facing North, rotated Math.PI so it is un-mirrored and identical from both sides)
    const back = new THREE.Mesh(geom, mat);
    back.position.set(x, boardY, z - halfThick);
    back.rotation.set(0, Math.PI, 0);
    planes.push(back);

    // Collision obstacle so player cannot walk through the bold board
    obstacles.push({
      x0: x - 3.7,
      x1: x + 3.7,
      z0: z - 0.35,
      z1: z + 0.35,
      level: 0,
    });

    // Baked warm lights matching the glowing lanterns on left and right sides
    bakes.push(
      { id: 'gdg_lantern_w', position: [x - 2.9, 2.3, z], power: 18, radius: 6 },
      { id: 'gdg_lantern_e', position: [x + 2.8, 2.2, z], power: 18, radius: 6 }
    );
  }

  buildWelcome(0, 12);
  buildTracks(-16, 0);
  buildSchedule(16, 0);
  buildPrizes(0, -10);
  buildSponsors(0, -18);
  buildTeam(-14, -14);
  buildFaq(-20, -2);
  buildVenue(-15, 8);
  buildRegister(8, 22);
  buildGDGSignboard(0, 0);

  return {
    batches: { static: B },
    planes,
    obstacles,
    hotspots,
    bakes,
  };
}
