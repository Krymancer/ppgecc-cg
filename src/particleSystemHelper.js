import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

async function loadModelAsync(url) {
  return new Promise((resolve, reject) => {
    loader.load(url, data => resolve(data), null, reject);
  });
}

const gltfData = await loadModelAsync('assets/suzanne.glb');
let suzanneMesh = gltfData.scene.children[0];
suzanneMesh.scale.set(0.01, 0.01, 0.01);

function fillWithPoints(geometry, count) {

  var dummyTarget = new THREE.Vector3(); // prevent break ray.at()

  var ray = new THREE.Ray();
  geometry.computeBoundingBox();
  let bbox = geometry.boundingBox;

  let points = [];

  var dir = new THREE.Vector3(1, 1, 1).normalize();
  for (let i = 0; i < count; i++) {
    let p = setRandomVector(bbox.min, bbox.max);
    points.push(p);
  }

  function setRandomVector(min, max) {
    let v = new THREE.Vector3(
      THREE.MathUtils.randFloat(min.x, max.x),
      THREE.MathUtils.randFloat(min.y, max.y),
      THREE.MathUtils.randFloat(min.z, max.z)
    );
    if (!isInside(v)) {
      return setRandomVector(min, max);
    }
    return v;
  }

  function isInside(v) {

    ray.set(v, dir);
    let counter = 0;

    let pos = geometry.attributes.position;
    let faces = pos.count / 3;
    let vA = new THREE.Vector3(), vB = new THREE.Vector3(), vC = new THREE.Vector3();

    for (let i = 0; i < faces; i++) {
      vA.fromBufferAttribute(pos, i * 3 + 0);
      vB.fromBufferAttribute(pos, i * 3 + 1);
      vC.fromBufferAttribute(pos, i * 3 + 2);

      if (ray.intersectTriangle(vA, vB, vC, false, dummyTarget)) counter++;
    }

    return counter % 2 == 1;
  }

  return points
}

export default function createParticleSystem(mesh, count = 1000) {
  const points = fillWithPoints(mesh.geometry, count);

  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const group = new THREE.Group();

  points.forEach(point => {
    let mesh;
    if(Math.random() > 0.6) { 
      mesh = new THREE.Mesh(new THREE.SphereGeometry(0.01, 8), material); 
    } else if (Math.random() > 0.3) {
      mesh = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.01, 0.01), material); 
    } else {
        mesh = suzanneMesh.clone();
    }
    mesh.position.copy(point);
    group.add(mesh);
  });

  group.add(mesh);

  return group;
}