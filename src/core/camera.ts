import * as THREE from 'three';

export function createCamera(aspect: number): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(52, aspect, 0.05, 12000);
  camera.position.set(0, 8, 36);
  return camera;
}
