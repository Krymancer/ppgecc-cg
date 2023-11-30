import * as THREE from 'three';

import createLetterMeshandGeometry from './letterHelper';
import createParticleSystemFromGeometey from './particleSystemHelper';

export default function createWordMesh(word, letterSpacing = 0.5) {
  const group = new THREE.Group();

  let offset = 0;
  for (const letter of word) {
    const mesh = createLetterMeshandGeometry(letter);
    const particles = createParticleSystemFromGeometey(mesh);
    particles.position.x = offset;
    group.add(particles);
    mesh.geometry.computeBoundingBox();
    offset += mesh.geometry.boundingBox.getSize(new THREE.Vector3()).x + letterSpacing;
  }

  const box = new THREE.Box3().setFromObject(group);
  const center = box.getCenter(new THREE.Vector3());
  group.position.sub(center);
  return group;
}