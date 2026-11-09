// Team: 3D Voxel GDG Hackathon Team Meeting.
// Local frame: (0, 0) is the centre, +z is the front (faces the path).
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default {
  size: [5.8, 3.2, 4.2],
  build({ box, solid, light, plane, mergeByMaterial, M }) {
    // Stepped Ceremonial Deepslate & Stone Dais
    box(0, 0, 0, 5.8, 0.2, 4.1, M.deepslate);
    box(0, 0.2, 0, 5.5, 0.15, 3.8, M.stone);

    // 3D GLTF Team Meeting Group
    const group = new THREE.Group();
    plane(group, 0, 0.35, 0);

    const loader = new GLTFLoader();
    loader.load('assets/gdg_hackathon_team_meeting.glb', (gltf) => {
      const model = gltf.scene;
      model.scale.setScalar(0.70);
      const optimized = mergeByMaterial(model);
      group.add(optimized);
    });

    solid(0, 0, 5.5, 3.8);
    light(0, 2.0, 1.8, 2.2, 9);
    light(0, 2.0, -1.8, 2.2, 9);
    light(-2.4, 2.2, 0, 2.0, 8);
    light(2.4, 2.2, 0, 2.0, 8);
  },
};
