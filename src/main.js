import * as THREE from 'three';
import createWordMesh from './wordHelper';

// Set up the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;

// Add an ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const acronym = 'PPGEEC';
const {wordMesh, letters}  = createWordMesh(acronym);
scene.add(wordMesh);

const box = new THREE.Box3().setFromObject(wordMesh);
const center = box.getCenter(new THREE.Vector3());

const spotLight = new THREE.SpotLight(0xff00ff, 5, 100);
spotLight.position.set(center.x, center.y , center.z + 1);
spotLight.target.position.copy(center);
scene.add(spotLight);

const updateParticlesWithWaves = () => {
  // Define a velocidade do movimento
  const speed = 0.05;

  // Define os parâmetros da onda
  const frequency = 1; // frequência da onda
  const amplitude = 0.5; // amplitude da onda

  // Move as partículas em uma onda ao longo do eixo Y
  letters.forEach(({ particles }) => {
    particles.position.x += speed;
    particles.position.y = amplitude * Math.sin(frequency * particles.position.x);

    // Reset a posição quando ultrapassar uma certa distância
    if (particles.position.x > 15) {
      particles.position.x = -10;
    }
  });
};

// Função para mover constantemente as partículas
const updateParticles = () => {
  // Define a velocidade do movimento
  const speed = 0.05;

  // Move as partículas em uma direção constante (por exemplo, ao longo do eixo X)
  letters.forEach(({ particles }) => {
    particles.position.x += speed;

    // Reset a posição quando ultrapassar uma certa distância
    if (particles.position.x > 15) {
      particles.position.x = -10;
    }
  });
};

wordMesh.addEventListener('update', updateParticlesWithWaves);

function animate() {
  requestAnimationFrame(animate);
  wordMesh.dispatchEvent({ type: 'update' });
  renderer.render(scene, camera);
}

animate();
