import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import createWordMesh from './wordHelper';

// Set up the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
const newWidth = window.innerWidth; 
const newHeight = window.innerHeight;
renderer.setSize(newWidth, newHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);

camera.position.z = 5;

// Add an ambient light
const ambientLight = new THREE.AmbientLight(0xFFFF00, 1);
scene.add(ambientLight);

const acronym = 'PPGEEC';
let wordMesh = createWordMesh(acronym);
wordMesh.position.x = -3;
scene.add(wordMesh);

const box = new THREE.Box3().setFromObject(wordMesh);
const center = box.getCenter(new THREE.Vector3());

const spotLight = new THREE.SpotLight(0xff00ff, 5, 10);
spotLight.position.set(center.x, center.y, center.z + 1);
spotLight.target.position.copy(center);
scene.add(spotLight);

// // Armazene as posições originais das partículas
const originalParticlePositions = [];

wordMesh.children.forEach((mesh) => {
  originalParticlePositions.push(mesh.position.clone());
});

//// Codigo realiza a dispersão das letras ao mouse passar por cima e retorna ao tirar o mouse
document.addEventListener('mousemove', (event) => {
  const mouseX = (event.clientX / newWidth) * 2 - 1;
  const mouseY = -(event.clientY / newHeight) * 2 + 1;

  wordMesh.children.forEach((letter, index) => {
    const letterPosition = originalParticlePositions[index].clone();
    const screenPosition = letterPosition.project(camera);
    const distance = Math.sqrt((mouseX - screenPosition.x) ** 2 + (mouseY - screenPosition.y) ** 2);

    const separationDistance = 0.3;
    const separationFactor = 1;
    // Set spotlight position based on mouse coordinates
    spotLight.position.x = mouseX * 5;
    spotLight.position.y = mouseY * 5;
    // Dispersa as particulas completamente se o mouse passar por cima da sigla
    letter.children.forEach((particle) => {
      if (distance < separationDistance) {
        // Apenas se o mouse estiver sobre a letra atual
        particle.originalPosition = particle.originalPosition || particle.position.clone();
        particle.position.x += Math.random() * separationFactor - separationFactor / 2;
        particle.position.y += Math.random() * separationFactor - separationFactor / 2;
      } else {
        // Se o mouse não estiver sobre a letra, restaure a posição original
        if (particle.originalPosition) {
          const resetFactor = 0.1;
          particle.position.lerp(particle.originalPosition, resetFactor);
        }
      }
    });
  });
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
    const radius = 0.5;
    mesh.position.y = Math.sin(angle) * radius;
    mesh.rotation.y = Math.cos(angle) * radius / 1.5;
  });

  controls.update();
  renderer.render(scene, camera);
}

animate();
