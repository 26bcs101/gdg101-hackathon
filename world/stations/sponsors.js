// Sponsors: 3D Voxel Green Dollar GDG Topper Monument.
// Local frame: (0, 0) is the centre, +z is the front (faces the path).
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default {
  size: [3.4, 4.0, 3.4],
  build({ box, solid, light, plane, mergeByMaterial, M }) {
    // Stepped Ceremonial Travertine & Emerald Dais
    box(0, 0, 0, 3.4, 0.2, 2.6, M.travertine);
    box(0, 0.2, 0, 3.0, 0.15, 2.2, M.concrete);
    box(0, 0.35, 0, 2.6, 0.04, 1.8, M.emerald);

    // 3D GLTF Dollar Topper Group
    const group = new THREE.Group();
    plane(group, 0, 0.39, 0);

    const loader = new GLTFLoader();
    loader.load('assets/gdg_green_dollar_gdg_topper.glb', (gltf) => {
      const model = gltf.scene;
      model.scale.setScalar(0.55);
      // Y is already UP in this model
      const optimized = mergeByMaterial(model);
      group.add(optimized);
    });

    solid(0, 0, 3.4, 2.6);
    light(0, 2.0, 1.2, 2.2, 8);
    light(0, 2.0, -1.2, 2.2, 8);
    light(-1.5, 2.2, 0, 2.0, 7);
    light(1.5, 2.2, 0, 2.0, 7);
  },
};
