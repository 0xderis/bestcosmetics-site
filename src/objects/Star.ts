import * as THREE from 'three';

function createGlowTexture(): THREE.Texture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.1,
    size / 2,
    size / 2,
    size / 2
  );

  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.4, 'rgba(255,226,170,0.62)');
  gradient.addColorStop(1, 'rgba(255,196,108,0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export class Star {
  readonly object: THREE.Group;
  readonly radius: number;
  readonly name: string;

  constructor(radius = 10, name = 'Sun') {
    this.radius = radius;
    this.name = name;

    const group = new THREE.Group();

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 72, 72),
      new THREE.MeshStandardMaterial({
        color: 0xffe2ad,
        emissive: 0xffc778,
        emissiveIntensity: 1.35,
        roughness: 0.35,
        metalness: 0
      })
    );
    group.add(sphere);

    const light = new THREE.PointLight(0xfff0cf, 3.0, 900, 1.35);
    group.add(light);

    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: createGlowTexture(),
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false
      })
    );
    const scale = radius * 8.8;
    glow.scale.set(scale, scale, 1);
    group.add(glow);

    this.object = group;
  }
}
