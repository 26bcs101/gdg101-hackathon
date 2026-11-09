// Team: a campfire circle with log benches, open towards the front.
// Local frame: (0, 0) is the centre, +z is the front (faces the path).
export default {
  size: [3.4, 2.0, 3.4],
  build({ box, solid, light, M }) {
    box(0, 0, 0, 1.4, 0.2, 1.4, M.stone);
    box(0, 0.18, 0, 0.9, 0.05, 0.9, M.blackMetal);
    for (const [lx, lz] of [[0.2, 0.2], [-0.2, -0.2], [-0.2, 0.2], [0.2, -0.2]]) box(lx, 0.23, lz, 0.14, 0.5, 0.14, M.log);
    box(0, 0.35, 0, 0.45, 0.55, 0.45, M.fireGlow);
    box(0, 0.45, 0, 0.25, 0.4, 0.25, M.paint(0xffeb3b));
    // Benches: back, left, right.
    box(0, 0.25, -1.35, 1.2, 0.18, 0.4, M.oak);
    box(-0.45, 0, -1.35, 0.2, 0.25, 0.35, M.log);
    box(0.45, 0, -1.35, 0.2, 0.25, 0.35, M.log);
    box(-1.35, 0.25, 0, 0.4, 0.18, 1.2, M.oak);
    box(-1.35, 0, -0.45, 0.35, 0.25, 0.2, M.log);
    box(-1.35, 0, 0.45, 0.35, 0.25, 0.2, M.log);
    box(1.35, 0.25, 0, 0.4, 0.18, 1.2, M.oak);
    box(1.35, 0, -0.45, 0.35, 0.25, 0.2, M.log);
    box(1.35, 0, 0.45, 0.35, 0.25, 0.2, M.log);
    // Backpack and bedroll.
    box(1.2, 0.43, -0.4, 0.32, 0.38, 0.24, M.paint(0xc0392b));
    box(1.2, 0.65, -0.4, 0.38, 0.14, 0.18, M.paint(0x27ae60));

    solid(0, 0, 1.4, 1.4);
    solid(0, -1.35, 1.2, 0.4);
    solid(-1.35, 0, 0.4, 1.2);
    solid(1.35, 0, 0.4, 1.2);
    light(0, 0.7, 0, 2.8, 11);
  },
};
