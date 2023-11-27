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
const wordMesh = createWordMesh(acronym);
scene.add(wordMesh);

const box = new THREE.Box3().setFromObject(wordMesh);
const center = box.getCenter(new THREE.Vector3());

const spotLight = new THREE.SpotLight(0xff00ff, 5, 100);
spotLight.position.set(center.x, center.y , center.z + 1);
spotLight.target.position.copy(center);
scene.add(spotLight);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
