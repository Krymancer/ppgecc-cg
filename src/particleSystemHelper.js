import * as THREE from 'three';

export default function createParticleSystemFromGeometry(object, count = 1000) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const group = new THREE.Group();

  // Ensure the geometry is non-indexed
  if (object.geometry.index !== null) {
    object.geometry = object.geometry.toNonIndexed();
  }

  for (let i = 0; i < count; i++) {
    // Select a random point from the BufferGeometry
    const index = Math.floor(Math.random() * (object.geometry.attributes.position.count / 3)) * 3; // Random triangle index
    const vertices = [
      new THREE.Vector3().fromBufferAttribute(object.geometry.attributes.position, index),
      new THREE.Vector3().fromBufferAttribute(object.geometry.attributes.position, index + 1),
      new THREE.Vector3().fromBufferAttribute(object.geometry.attributes.position, index + 2)
    ];

    const barycoord = new THREE.Vector3(Math.random(), Math.random(), Math.random());
    barycoord.normalize(); // Ensure the point is inside the triangle

    const position = new THREE.Vector3();
    position.copy(vertices[0]).multiplyScalar(barycoord.x);
    position.addScaledVector(vertices[1], barycoord.y);
    position.addScaledVector(vertices[2], barycoord.z);

    positions[i * 3] = position.x;
    positions[i * 3 + 1] = position.y;
    positions[i * 3 + 2] = position.z;

    const particleGeometry = new THREE.SphereGeometry(0.01); // Adjust size as needed
    const particleMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.set(position.x, position.y, position.z);
    group.add(particle);
  }

  return group;
}