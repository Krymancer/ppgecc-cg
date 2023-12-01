import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import createWordMesh from './wordHelper';

// Set up the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls( camera, renderer.domElement );

camera.position.z = 5;

// Add an ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const acronym = 'PPGEEC';
let wordMesh = createWordMesh(acronym);
wordMesh.position.x = -3;
scene.add(wordMesh);

const box = new THREE.Box3().setFromObject(wordMesh);
const center = box.getCenter(new THREE.Vector3());

const spotLight = new THREE.SpotLight(0xff00ff, 5, 10);
spotLight.position.set(center.x, center.y , center.z + 1);
spotLight.target.position.copy(center);
scene.add(spotLight);

document.addEventListener('mousemove', (event) => {
  // Normalize mouse coordinates to range [-1, 1]
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

  // Set spotlight position based on mouse coordinates
  spotLight.position.x = mouseX * 5;
  spotLight.position.y = mouseY * 5;
});

const input = document.getElementById('n');
const button = document.getElementById('btn');

button.addEventListener('click', () => {
  const n = parseInt(input.value);
  scene.remove(wordMesh);
  wordMesh = createWordMesh(acronym, n);
  wordMesh.position.x = -3;
  scene.add(wordMesh);
});

function animate() {
  requestAnimationFrame(animate);

  wordMesh.children.forEach((mesh, index) => {
    // Example: Move meshes in a circular motion
    const angle = Date.now() * 0.001 * (index + 1);
    const radius = 1;
    mesh.position.y = Math.sin(angle) * radius;
    mesh.rotation.y = Math.cos(angle) * radius/2;
  });

  controls.update();
  renderer.render(scene, camera);
}

animate();
