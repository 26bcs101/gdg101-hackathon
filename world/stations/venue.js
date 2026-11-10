// Venue: 3D Voxel GDG Labyrinth Venue Pavilion Building.
// Local frame: (0, 0) is the centre, +z is the front (faces the path).
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// Merges all GLTF meshes into a single vertex-colored mesh to stay strictly within draw call budget (≤ 60).
function mergeVenueModel(root) {
  root.updateMatrixWorld(true);
  const geoms = [];

  root.traverse((child) => {
    if (child.isMesh && child.geometry) {
      let geom = child.geometry.clone();
      geom.applyMatrix4(child.matrixWorld);
      if (geom.index) {
        geom = geom.toNonIndexed();
      }
      geom.computeVertexNormals();

      const count = geom.attributes.position.count;
      const colors = new Float32Array(count * 3);
      const mat = child.material;
      const c = mat?.color || new THREE.Color(0xffffff);

      // Enhance GDG logo elements with official vibrant Google palette
      let r = c.r;
      let g = c.g;
      let b = c.b;
      const name = child.name.toLowerCase();
      if (name.includes('gdg_') || name.includes('banner_logo') || name.includes('reception_gdg')) {
        if (name.includes('red') || name.endsWith('1') || name.endsWith('5')) {
          // Google Red: #ea4335
          r = 0.92; g = 0.26; b = 0.21;
        } else if (name.includes('blue') || name.endsWith('0') || name.endsWith('4')) {
          // Google Blue: #4285f4
          r = 0.26; g = 0.52; b = 0.96;
        } else if (name.includes('green') || name.endsWith('2') || name.endsWith('6')) {
          // Google Green: #34a853
          r = 0.20; g = 0.66; b = 0.33;
        } else if (name.includes('yellow') || name.endsWith('3') || name.endsWith('7')) {
          // Google Yellow: #fbbc05
          r = 0.98; g = 0.74; b = 0.02;
        }
      }

      // Subtle emissive boost for letters and logos
      const isEmissive = (mat?.emissive && (mat.emissive.r > 0.05 || mat.emissive.g > 0.05 || mat.emissive.b > 0.05)) ||
        name.includes('gdg_') || name.includes('banner_logo') || name.includes('letter');
      const boost = isEmissive ? 1.25 : 1.0;

      for (let i = 0; i < count; i++) {
        colors[i * 3] = Math.min(1, r * boost);
        colors[i * 3 + 1] = Math.min(1, g * boost);
        colors[i * 3 + 2] = Math.min(1, b * boost);
      }
      geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geoms.push(geom);
    }
  });

  const merged = mergeGeometries(geoms, false);
  const material = new THREE.MeshLambertMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(merged, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export default {
  size: [5.6, 2.8, 4.4],
  build({ box, solid, light, plane, M }) {
    // 3D GLTF Venue Building Group
    const group = new THREE.Group();
    plane(group, 0, 0, 0);

    const loader = new GLTFLoader();
    loader.load('assets/gdg_labyrinth_venue_building.glb', (gltf) => {
      const model = gltf.scene;
      model.scale.setScalar(0.28);
      const optimized = mergeVenueModel(model);
      group.add(optimized);
    });

    solid(0, 0, 5.6, 4.4);
    // Interior booth glow and exterior sign lights for night
    light(0, 1.3, 0.2, 2.5, 8);
    light(0, 2.2, 1.4, 2.2, 8);
    light(-1.8, 1.8, 0.8, 2.0, 7);
    light(1.8, 1.8, 0.8, 2.0, 7);
  },
};
