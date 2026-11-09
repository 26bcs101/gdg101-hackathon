// Venue: a cartographer's deck with a map table, a telescope and supplies.
// Local frame: (0, 0) is the centre, +z is the front (faces the path).
export default {
  size: [3.0, 2.0, 3.0],
  build({ box, solid, light, M }) {
    box(0, 0, 0, 2.8, 0.35, 2.8, M.deck);
    // Rails along the back and left.
    box(0, 0.35, -1.3, 2.7, 0.5, 0.08, M.log);
    box(-1.3, 0.35, 0, 0.08, 0.5, 2.7, M.log);
    // Map table.
    box(0.3, 0.35, -0.15, 1.3, 0.75, 0.85, M.wood);
    box(0.3, 1.1, -0.15, 1.0, 0.02, 0.65, M.paper);
    box(0.65, 1.12, 0.1, 0.25, 0.02, 0.2, M.lapis);
    // Telescope.
    box(-0.7, 0.35, 0.6, 0.45, 0.85, 0.45, M.wood);
    box(-0.7, 1.2, 0.6, 0.65, 0.12, 0.12, M.gold);
    // Barrel and crate.
    box(0.9, 0.35, 0.8, 0.55, 0.65, 0.55, M.log);
    box(-0.8, 0.35, -0.8, 0.5, 0.5, 0.5, M.oak);

    solid(0, 0, 2.8, 2.8);
    light(0.3, 1.2, -0.15, 2.0, 8);
  },
};
