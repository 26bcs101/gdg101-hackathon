// Station frames without any three.js: layout.js and kit.js both use these.

// Station facing, as the yaw of its front. 0 faces south (+z).
export const FACING = { south: 0, east: Math.PI / 2, north: Math.PI, west: -Math.PI / 2 };
export const yawOf = face => (typeof face === 'number' ? face : FACING[face] ?? 0);

// Where local (lx, lz) lands in the world for a station at (x, z) turned by yaw.
// Matches BoxBatch.at(), which rotates about +y: local +z becomes (sin yaw, cos yaw).
export function toWorld(x, z, yaw, lx, lz) {
  const c = Math.cos(yaw), s = Math.sin(yaw);
  return [x + lx * c + lz * s, z - lx * s + lz * c];
}
