// Prizes: a treasure dais with a trophy, a chest and an emerald pedestal.
// Local frame: (0, 0) is the centre, +z is the front (faces the path).
export default {
  size: [3.0, 2.0, 3.0],
  build({ box, solid, light, M }) {
    box(0, 0, 0, 2.8, 0.35, 2.8, M.deepslate);
    box(0, 0.35, 0, 1.4, 0.03, 2.7, M.redVelvet);
    // Trophy on a gold plinth.
    box(0, 0.38, -0.4, 0.85, 0.65, 0.85, M.gold);
    box(0, 1.03, -0.4, 0.3, 0.08, 0.3, M.gold);
    box(0, 1.11, -0.4, 0.12, 0.18, 0.12, M.gold);
    box(0, 1.29, -0.4, 0.42, 0.32, 0.42, M.goldGlow);
    box(0, 1.45, -0.4, 0.18, 0.18, 0.18, M.diamond);
    // Chest.
    box(0.85, 0.38, 0.4, 0.85, 0.45, 0.55, M.wood);
    box(0.85, 0.83, 0.4, 0.85, 0.14, 0.55, M.oak);
    box(0.85, 0.55, 0.69, 0.12, 0.14, 0.05, M.gold);
    // Emerald pedestal.
    box(-0.85, 0.38, 0.4, 0.55, 0.5, 0.55, M.obsidian);
    box(-0.85, 0.88, 0.4, 0.26, 0.26, 0.26, M.emerald);

    solid(0, 0, 2.8, 2.8);
    light(0, 1.4, -0.4, 2.5, 9);
    light(0.85, 0.7, 0.4, 1.8, 6);
  },
};
