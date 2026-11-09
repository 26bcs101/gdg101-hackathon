// Prizes: 3D Voxel GDG Labyrinth Championship Trophy.
// Local frame: (0, 0) is the centre, +z is the front (faces the path).
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default {
  size: [3.4, 4.0, 3.4],
  build({ box, solid, light, plane, mergeByMaterial, M }) {
    // Stepped Ceremonial Dais
    box(0, 0, 0, 3.2, 0.2, 2.6, M.deepslate);
    box(0, 0.2, 0, 2.8, 0.15, 2.2, M.stone);
    box(0, 0.35, 0, 2.4, 0.04, 1.8, M.redVelvet);

    // 3D GLTF Trophy Group
    const group = new THREE.Group();
    plane(group, 0, 0.39, 0);

    const loader = new GLTFLoader();
    loader.load('assets/gdg_labyrinth_trophy.glb', (gltf) => {
      const model = gltf.scene;
      model.scale.setScalar(0.68);
      // In the GLB, Z is UP. Rotate around X by -90 deg so Z becomes +Y (UP)
      model.rotation.x = -Math.PI / 2;
      const optimized = mergeByMaterial(model);
      group.add(optimized);
    });

    solid(0, 0, 3.2, 2.6);
    light(0, 1.8, 1.2, 2.2, 8);
    light(0, 1.8, -1.2, 2.2, 8);
    light(-1.4, 2.0, 0, 2.0, 7);
    light(1.4, 2.0, 0, 2.0, 7);
  },
};
