import * as THREE from 'three';

function createStarField(count: number, radius: number, size: number, opacity: number): THREE.Points {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const color = new THREE.Color();

  for (let i = 0; i < count; i += 1) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 2;
    const phi = Math.acos(2 * v - 1);

    const dist = radius * (0.82 + Math.random() * 0.18);
    const x = dist * Math.sin(phi) * Math.cos(theta);
    const y = dist * Math.sin(phi) * Math.sin(theta);
    const z = dist * Math.cos(phi);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const tint = 0.72 + Math.random() * 0.28;
    color.setRGB(tint, tint, 1.0);

    if (Math.random() > 0.9) {
      color.setRGB(1.0, 0.92 + Math.random() * 0.08, 0.8 + Math.random() * 0.12);
    }

    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size,
    vertexColors: true,
    transparent: true,
    opacity,
    depthWrite: false
  });

  return new THREE.Points(geometry, material);
}

function createDustBand(): THREE.Points {
  const count = 2200;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 950 + Math.random() * 450;

    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x7394c0,
    size: 2.6,
    transparent: true,
    opacity: 0.06,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  return new THREE.Points(geometry, material);
}

export function createScene(): THREE.Scene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x02040b);

  scene.add(createStarField(4800, 1800, 2.2, 0.96));
  scene.add(createStarField(2500, 1400, 3.5, 0.32));
  scene.add(createDustBand());

  return scene;
}
