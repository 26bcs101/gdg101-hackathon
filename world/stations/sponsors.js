// Sponsors: a quartz pavilion around a beacon whose beam marks the island's north.
// Local frame: (0, 0) is the centre, +z is the front (faces the path).
export default {
  size: [3.0, 3.0, 3.0],
  build({ box, solid, light, M }) {
    box(0, 0, 0, 2.8, 0.45, 2.8, M.travertine);
    box(0, 0.45, 0, 2.4, 0.02, 2.4, M.lapis);
    for (const px of [-1.0, 1.0]) for (const pz of [-1.0, 1.0]) box(px, 0.47, pz, 0.32, 2.3, 0.32, M.concrete);
    box(0, 2.77, 0, 2.6, 0.25, 2.6, M.travertine);
    // Beacon and its beam.
    box(0, 0.47, 0, 0.9, 0.45, 0.9, M.obsidian);
    box(0, 0.92, 0, 0.55, 0.45, 0.55, M.diamond);
    box(0, 1.37, 0, 0.28, 14.0, 0.28, M.beaconGlow);
    box(0, 1.75, 0.65, 1.2, 0.08, 0.1, M.beaconGlow);
    box(0, 1.75, -0.65, 1.2, 0.08, 0.1, M.beaconGlow);
    box(0.65, 1.75, 0, 0.1, 0.08, 1.2, M.beaconGlow);
    box(-0.65, 1.75, 0, 0.1, 0.08, 1.2, M.beaconGlow);

    solid(0, 0, 2.8, 2.8);
    light(0, 1.8, 0, 3.5, 14);
  },
};
