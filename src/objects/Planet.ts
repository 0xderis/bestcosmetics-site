import * as THREE from 'three';

export type PlanetClass = 'rocky' | 'gas' | 'ice';

export interface PlanetRingOptions {
  innerRadiusScale: number;
  outerRadiusScale: number;
  colorA: string;
  colorB: string;
  tiltDeg?: number;
}

export interface PlanetOptions {
  name: string;
  radius: number;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  planetClass: PlanetClass;
  baseColor: number;
  accentColor?: number;
  atmosphereColor?: number;
  atmosphereOpacity?: number;
  ring?: PlanetRingOptions;
  axialTiltDeg?: number;
  orbitInclinationDeg?: number;
}

function createCanvasTexture(size: number, painter: (ctx: CanvasRenderingContext2D, size: number) => void): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  painter(ctx, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function createRockyTexture(base: THREE.Color, accent: THREE.Color, craterCount: number): THREE.Texture {
  return createCanvasTexture(1024, (ctx, size) => {
    ctx.fillStyle = `#${base.getHexString()}`;
    ctx.fillRect(0, 0, size, size);

    const imageData = ctx.getImageData(0, 0, size, size);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const noise = 0.8 + Math.random() * 0.4;
      imageData.data[i] = Math.min(255, imageData.data[i] * noise);
      imageData.data[i + 1] = Math.min(255, imageData.data[i + 1] * noise);
      imageData.data[i + 2] = Math.min(255, imageData.data[i + 2] * noise);
    }
    ctx.putImageData(imageData, 0, 0);

    for (let i = 0; i < craterCount; i += 1) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const radius = randomRange(size * 0.006, size * 0.035);

      const crater = ctx.createRadialGradient(x, y, radius * 0.25, x, y, radius);
      crater.addColorStop(0, `rgba(35,30,30,${randomRange(0.16, 0.3).toFixed(2)})`);
      crater.addColorStop(0.65, `rgba(20,18,18,${randomRange(0.2, 0.35).toFixed(2)})`);
      crater.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = crater;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = `rgba(${Math.floor(accent.r * 255)}, ${Math.floor(accent.g * 255)}, ${Math.floor(accent.b * 255)}, 0.35)`;
      ctx.lineWidth = radius * 0.08;
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.9, 0, Math.PI * 2);
      ctx.stroke();
    }
  });
}

function createGasTexture(colors: string[]): THREE.Texture {
  return createCanvasTexture(1024, (ctx, size) => {
    const stripeHeight = size / colors.length;

    colors.forEach((color, index) => {
      const y = index * stripeHeight;
      ctx.fillStyle = color;
      ctx.fillRect(0, y, size, stripeHeight + 1);
    });

    for (let i = 0; i < 5000; i += 1) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const w = randomRange(10, 80);
      const h = randomRange(1.2, 3.2);
      const alpha = randomRange(0.03, 0.09);
      ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
      ctx.fillRect(x, y, w, h);
    }
  });
}

function createRingTexture(colorA: string, colorB: string): THREE.Texture {
  const width = 1024;
  const height = 64;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, colorA);
  gradient.addColorStop(0.5, colorB);
  gradient.addColorStop(1, colorA);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  for (let x = 0; x < width; x += 1) {
    const alpha = randomRange(0.06, 0.45);
    ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
    ctx.fillRect(x, 0, 1, height);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.6, 1);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createPlanetTexture(options: PlanetOptions): THREE.Texture {
  if (options.planetClass === 'gas') {
    if (options.name === 'Jupiter') {
      return createGasTexture(['#ceb08b', '#d8be9b', '#bc936e', '#d8c3a4', '#b98663', '#dec8a9']);
    }

    if (options.name === 'Saturn') {
      return createGasTexture(['#d8c39c', '#c5ad86', '#e1ceaa', '#b89d72', '#d7c39f']);
    }
  }

  if (options.planetClass === 'ice') {
    if (options.name === 'Uranus') {
      return createGasTexture(['#b8e5e9', '#a7d6dd', '#c4edf0', '#9bcad3']);
    }

    return createGasTexture(['#5ea2df', '#4d8ed0', '#79b7f0', '#4b83bd']);
  }

  const base = new THREE.Color(options.baseColor);
  const accent = new THREE.Color(options.accentColor ?? 0x7f756e);
  const craterCount = options.name === 'Mercury' ? 1000 : options.name === 'Mars' ? 680 : 520;

  return createRockyTexture(base, accent, craterCount);
}

export class Planet {
  readonly object: THREE.Group;
  readonly radius: number;
  readonly orbitRadius: number;
  readonly orbitSpeed: number;
  readonly rotationSpeed: number;
  readonly name: string;

  private orbitAngle: number;
  private readonly spinRoot: THREE.Group;
  private readonly surfaceMesh: THREE.Mesh;
  private readonly orbitInclinationRad: number;

  constructor(options: PlanetOptions) {
    this.radius = options.radius;
    this.orbitRadius = options.orbitRadius;
    this.orbitSpeed = options.orbitSpeed;
    this.rotationSpeed = options.rotationSpeed;
    this.name = options.name;

    this.orbitAngle = Math.random() * Math.PI * 2;
    this.orbitInclinationRad = THREE.MathUtils.degToRad(options.orbitInclinationDeg ?? 0);

    const root = new THREE.Group();
    const spinRoot = new THREE.Group();
    spinRoot.rotation.z = THREE.MathUtils.degToRad(options.axialTiltDeg ?? 0);

    const geometry = new THREE.SphereGeometry(options.radius, 72, 72);
    const texture = createPlanetTexture(options);

    const material = new THREE.MeshPhysicalMaterial({
      color: options.baseColor,
      roughness: options.planetClass === 'rocky' ? 0.82 : 0.5,
      metalness: 0,
      clearcoat: options.planetClass === 'rocky' ? 0.02 : 0.22,
      clearcoatRoughness: options.planetClass === 'rocky' ? 0.85 : 0.45,
      sheen: options.planetClass === 'gas' || options.planetClass === 'ice' ? 0.24 : 0.06,
      sheenRoughness: 0.6,
      map: texture,
      emissive: 0x0a0f18,
      emissiveIntensity: options.planetClass === 'rocky' ? 0.018 : 0.028
    });

    const surfaceMesh = new THREE.Mesh(geometry, material);
    surfaceMesh.castShadow = true;
    surfaceMesh.receiveShadow = true;
    spinRoot.add(surfaceMesh);

    if (options.atmosphereColor !== undefined) {
      const atmosphereGeometry = new THREE.SphereGeometry(options.radius * 1.05, 64, 64);
      const atmosphereMaterial = new THREE.MeshPhongMaterial({
        color: options.atmosphereColor,
        emissive: options.atmosphereColor,
        emissiveIntensity: 0.12,
        transparent: true,
        opacity: options.atmosphereOpacity ?? 0.14,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      atmosphere.castShadow = false;
      atmosphere.receiveShadow = false;
      spinRoot.add(atmosphere);
    }

    if (options.ring) {
      const innerRadius = options.radius * options.ring.innerRadiusScale;
      const outerRadius = options.radius * options.ring.outerRadiusScale;
      const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 160);
      const ringTexture = createRingTexture(options.ring.colorA, options.ring.colorB);

      const uv = ringGeometry.attributes.uv;
      const position = ringGeometry.attributes.position;
      const temp = new THREE.Vector3();

      for (let i = 0; i < uv.count; i += 1) {
        temp.fromBufferAttribute(position, i);
        const radius = temp.length();
        const v = (radius - innerRadius) / (outerRadius - innerRadius);
        uv.setXY(i, v, 1 - v);
      }

      const ringMaterial = new THREE.MeshStandardMaterial({
        map: ringTexture,
        color: 0xe3d4bf,
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide,
        roughness: 0.75,
        metalness: 0,
        alphaTest: 0.1
      });

      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = THREE.MathUtils.degToRad(90 + (options.ring.tiltDeg ?? 0));
      ring.castShadow = true;
      ring.receiveShadow = true;
      spinRoot.add(ring);
    }

    root.add(spinRoot);

    this.object = root;
    this.spinRoot = spinRoot;
    this.surfaceMesh = surfaceMesh;
  }

  update(dt: number): void {
    this.orbitAngle += this.orbitSpeed * dt;

    const x = Math.cos(this.orbitAngle) * this.orbitRadius;
    const z = Math.sin(this.orbitAngle) * this.orbitRadius;
    const y = Math.sin(this.orbitAngle * 0.9) * this.orbitRadius * Math.sin(this.orbitInclinationRad);

    this.object.position.set(x, y, z);
    this.surfaceMesh.rotation.y += this.rotationSpeed * dt;
  }

  getSpinRoot(): THREE.Group {
    return this.spinRoot;
  }
}
