import * as THREE from 'three';

export class AsteroidField {
  readonly object: THREE.Group;

  constructor(options?: {
    count?: number;
    innerRadius?: number;
    outerRadius?: number;
    verticalSpread?: number;
  }) {
    const count = options?.count ?? 560;
    const innerRadius = options?.innerRadius ?? 92;
    const outerRadius = options?.outerRadius ?? 128;
    const verticalSpread = options?.verticalSpread ?? 4;

    const group = new THREE.Group();

    const asteroidGeometry = new THREE.IcosahedronGeometry(0.33, 0);
    const asteroidMaterial = new THREE.MeshStandardMaterial({
      color: 0x6f6762,
      roughness: 0.95,
      metalness: 0
    });

    const mesh = new THREE.InstancedMesh(asteroidGeometry, asteroidMaterial, count);
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = THREE.MathUtils.lerp(innerRadius, outerRadius, Math.random());
      const y = (Math.random() - 0.5) * verticalSpread;

      position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      quaternion.setFromEuler(
        new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
      );

      const size = THREE.MathUtils.lerp(0.45, 2.4, Math.pow(Math.random(), 2.5));
      scale.set(
        size,
        size * THREE.MathUtils.lerp(0.65, 1.35, Math.random()),
        size * THREE.MathUtils.lerp(0.65, 1.35, Math.random())
      );

      matrix.compose(position, quaternion, scale);
      mesh.setMatrixAt(i, matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
    group.add(mesh);

    const debrisGeometry = new THREE.BufferGeometry();
    const debrisCount = 360;
    const debrisPositions = new Float32Array(debrisCount * 3);

    for (let i = 0; i < debrisCount; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = THREE.MathUtils.lerp(innerRadius * 0.92, outerRadius * 1.05, Math.random());
      debrisPositions[i * 3] = Math.cos(angle) * radius;
      debrisPositions[i * 3 + 1] = (Math.random() - 0.5) * verticalSpread * 1.8;
      debrisPositions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    debrisGeometry.setAttribute('position', new THREE.BufferAttribute(debrisPositions, 3));

    const debrisMaterial = new THREE.PointsMaterial({
      color: 0x9f9588,
      size: 0.28,
      transparent: true,
      opacity: 0.46,
      depthWrite: false
    });

    group.add(new THREE.Points(debrisGeometry, debrisMaterial));

    this.object = group;
  }
}
