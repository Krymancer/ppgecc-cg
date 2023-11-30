import * as THREE from 'three';

export default function createParticleSystemFromGeometry(object, count = 1000) {
  var geometry = object.geometry;
  const positions = new Float32Array(count * 3);
  const group = new THREE.Group();

  if (object.geometry.index !== null) {
    geometry = object.geometry.toNonIndexed();
  }

  const particleGeometry = new THREE.SphereGeometry(0.01); // Adjust size as needed
  const particleMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

  const particleCount = count;
  const particles = new THREE.InstancedMesh(particleGeometry, particleMaterial, particleCount);

  for (let i = 0; i < particleCount; i++) {
    const index = Math.floor(Math.random() * (geometry.attributes.position.count / 3)) * 3; // Random triangle index
    const vertices = [
      new THREE.Vector3().fromBufferAttribute(geometry.attributes.position, index),
      new THREE.Vector3().fromBufferAttribute(geometry.attributes.position, index + 1),
      new THREE.Vector3().fromBufferAttribute(geometry.attributes.position, index + 2)
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

    particles.setMatrixAt(i, new THREE.Matrix4().setPosition(position));
  }

  group.add(particles);
  return group;
}
