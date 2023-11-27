import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import typefaceData from '@compai/font-roboto/data/typefaces/normal-100.json'

const font = new FontLoader().parse(typefaceData);

/**
 * Creates a new TextGeometry object with the given letter.
 *
 * @param {string} letter - The letter to be converted into TextGeometry.
 * @returns {THREE.Mesh} The TextGeometry object and Mesh object representing the letter.
 */
export default function createLetterMeshandGeometry(letter) {
  const textGeometry = new TextGeometry(letter, {
    font: font,
    size: 1, // Adjust the size as needed
    height: 0.1, // Extrusion depth
    curveSegments: 12,
    bevelEnabled: false,
  });
  
  const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0 });
  
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  
  textMesh.position.set(0, 0, 0);
  
  return  textMesh;
}

