import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import typefaceData from "@compai/font-recursive/data/typefaces/normal-400.json";

// Set up the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;

const font = new FontLoader().parse(typefaceData);

const textGeometry = new TextGeometry('P', {
	font: font,
	size: 1, // Adjust the size as needed
	height: 0.1, // Extrusion depth
	curveSegments: 12,
	bevelEnabled: false,
});

const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

const textMesh = new THREE.Mesh(textGeometry, textMaterial);

// Position and add the text mesh to the scene
textMesh.position.set(0, 0, 0);
scene.add(textMesh);

const particleCount = 1000;
const particles = new THREE.Group();

const positions = textGeometry.attributes.position;

for (let i = 0; i < particleCount; i++) {
  const randomIndex = Math.floor(Math.random() * positions.count);
  const randomVertex = new THREE.Vector3().fromBufferAttribute(positions, randomIndex);

  // Add particles at the random vertices
  const particle = new THREE.Mesh(new THREE.SphereGeometry(0.02), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  particle.position.copy(randomVertex);
  particles.add(particle);
}

scene.add(particles);

function animate() {
  requestAnimationFrame(animate);

  // Render the scene
  renderer.render(scene, camera);
}

// Start the animation loop
animate();
