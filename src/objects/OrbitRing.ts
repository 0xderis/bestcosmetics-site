import * as THREE from 'three';

export class OrbitRing {
  readonly object: THREE.LineLoop;

  constructor(radius: number, color = 0xffffff, opacity = 0.22) {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, false, 0);
    const points = curve.getPoints(192);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    geometry.rotateX(Math.PI / 2);

    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity
    });

    this.object = new THREE.LineLoop(geometry, material);
  }
}
