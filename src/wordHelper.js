import * as THREE from 'three';
import createLetterMeshandGeometry from './letterHelper';
import createParticleSystemFromGeometey from './particleSystemHelper';

export default function createWordMesh(word, letterSpacing = 1) {
  const group = new THREE.Group();

  let offset = 0;
  const letters = [];

  for (const letter of word) {
    const mesh = createLetterMeshandGeometry(letter);
    mesh.position.x = offset;
    group.add(mesh);

    // Create a particle system for the letter
    const particles = createParticleSystemFromGeometey(mesh);
    particles.position.x = offset;
    group.add(particles);

    // Store the letter and its particles in an array
    letters.push({ letter: mesh, particles: particles });

    // Update the offset for the next letter
    mesh.geometry.computeBoundingBox();
    offset += mesh.geometry.boundingBox.getSize(new THREE.Vector3()).x + letterSpacing;
  }

  // Calculate the bounding box of the group
  const box = new THREE.Box3().setFromObject(group);

  // Calculate the center of the bounding box
  const center = box.getCenter(new THREE.Vector3());

  // Adjust the position of the group to center it
  group.position.sub(center);

  return {
    wordMesh: group,
    letters: letters
  }
}