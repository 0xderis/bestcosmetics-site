import * as THREE from 'three';

export interface MarsTexturePaths {
  day: string;
  bump: string;
}

export interface MarsOptions {
  radius: number;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  axialTiltDeg?: number;
  orbitInclinationDeg?: number;
  texturePaths?: MarsTexturePaths;
}

const DEFAULT_TEXTURE_PATHS: MarsTexturePaths = {
  day: '/textures/mars_day_1k.jpg',
  bump: '/textures/mars_bump_1k.jpg'
};

function loadTexture(loader: THREE.TextureLoader, path: string): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    loader.load(path, resolve, undefined, reject);
  });
}

function createNormalMapFromBump(
  bumpTexture: THREE.Texture,
  strength = 5
): THREE.CanvasTexture {
  const image = bumpTexture.image as HTMLImageElement;
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;

  const sourceCanvas = document.createElement('canvas');
  sourceCanvas.width = width;
  sourceCanvas.height = height;
  const sourceCtx = sourceCanvas.getContext('2d');
  if (!sourceCtx) {
    throw new Error('Canvas 2D context is unavailable');
  }
  sourceCtx.drawImage(image, 0, 0);
  const sourceData = sourceCtx.getImageData(0, 0, width, height).data;

  const targetCanvas = document.createElement('canvas');
  targetCanvas.width = width;
  targetCanvas.height = height;
  const targetCtx = targetCanvas.getContext('2d');
  if (!targetCtx) {
    throw new Error('Canvas 2D context is unavailable');
  }

  const normalImage = targetCtx.createImageData(width, height);
  const normalData = normalImage.data;

  const getHeight = (x: number, y: number): number => {
    const px = ((y + height) % height) * width + ((x + width) % width);
    return sourceData[px * 4] / 255;
  };

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const left = getHeight(x - 1, y);
      const right = getHeight(x + 1, y);
      const up = getHeight(x, y - 1);
      const down = getHeight(x, y + 1);

      const dx = (right - left) * strength;
      const dy = (down - up) * strength;

      const nx = -dx;
      const ny = -dy;
      const nz = 1;
      const invLength = 1 / Math.sqrt(nx * nx + ny * ny + nz * nz);

      const i = (y * width + x) * 4;
      normalData[i] = Math.round((nx * invLength * 0.5 + 0.5) * 255);
      normalData[i + 1] = Math.round((ny * invLength * 0.5 + 0.5) * 255);
      normalData[i + 2] = Math.round((nz * invLength * 0.5 + 0.5) * 255);
      normalData[i + 3] = 255;
    }
  }

  targetCtx.putImageData(normalImage, 0, 0);

  const normalTexture = new THREE.CanvasTexture(targetCanvas);
  normalTexture.wrapS = THREE.RepeatWrapping;
  normalTexture.wrapT = THREE.RepeatWrapping;
  normalTexture.needsUpdate = true;
  return normalTexture;
}

export class Mars {
  readonly name = 'Mars';
  readonly object = new THREE.Group();
  readonly radius: number;

  private readonly surfaceMesh: THREE.Mesh;
  private orbitAngle = Math.random() * Math.PI * 2;
  private readonly orbitRadius: number;
  private readonly orbitSpeed: number;
  private readonly rotationSpeed: number;
  private readonly orbitInclinationRad: number;

  private constructor(
    options: MarsOptions,
    surfaceMesh: THREE.Mesh,
    atmosphereMesh: THREE.Mesh | null
  ) {
    this.radius = options.radius;
    this.orbitRadius = options.orbitRadius;
    this.orbitSpeed = options.orbitSpeed;
    this.rotationSpeed = options.rotationSpeed;
    this.orbitInclinationRad = THREE.MathUtils.degToRad(options.orbitInclinationDeg ?? 1.8);

    const spinRoot = new THREE.Group();
    spinRoot.rotation.z = THREE.MathUtils.degToRad(options.axialTiltDeg ?? 25);
    spinRoot.add(surfaceMesh);

    if (atmosphereMesh) {
      spinRoot.add(atmosphereMesh);
    }

    this.object.add(spinRoot);
    this.surfaceMesh = surfaceMesh;
  }

  static async create(renderer: THREE.WebGLRenderer, options: MarsOptions): Promise<Mars> {
    const texturePaths = options.texturePaths ?? DEFAULT_TEXTURE_PATHS;
    const loader = new THREE.TextureLoader();

    const [dayTexture, bumpTexture] = await Promise.all([
      loadTexture(loader, texturePaths.day),
      loadTexture(loader, texturePaths.bump)
    ]);

    dayTexture.colorSpace = THREE.SRGBColorSpace;
    const anisotropy = renderer.capabilities.getMaxAnisotropy();
    dayTexture.anisotropy = anisotropy;
    bumpTexture.anisotropy = anisotropy;

    const normalTexture = createNormalMapFromBump(bumpTexture, 5.4);
    normalTexture.anisotropy = anisotropy;

    const geometry = new THREE.SphereGeometry(options.radius, 128, 128);
    const material = new THREE.MeshStandardMaterial({
      color: 0xfff6ee,
      map: dayTexture,
      normalMap: normalTexture,
      normalScale: new THREE.Vector2(1.8, 1.8),
      roughness: 0.93,
      metalness: 0,
      bumpMap: bumpTexture,
      bumpScale: 0.06
    });

    const surfaceMesh = new THREE.Mesh(geometry, material);
    surfaceMesh.castShadow = true;
    surfaceMesh.receiveShadow = true;

    const atmosphereMesh = new THREE.Mesh(
      new THREE.SphereGeometry(options.radius * 1.01, 72, 72),
      new THREE.MeshPhongMaterial({
        color: 0xd2a58a,
        emissive: 0x4b3429,
        emissiveIntensity: 0.01,
        transparent: true,
        opacity: 0.045,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    atmosphereMesh.castShadow = false;
    atmosphereMesh.receiveShadow = false;

    return new Mars(options, surfaceMesh, atmosphereMesh);
  }

  update(dt: number): void {
    this.orbitAngle += this.orbitSpeed * dt;

    const x = Math.cos(this.orbitAngle) * this.orbitRadius;
    const z = Math.sin(this.orbitAngle) * this.orbitRadius;
    const y = Math.sin(this.orbitAngle * 0.9) * this.orbitRadius * Math.sin(this.orbitInclinationRad);

    this.object.position.set(x, y, z);
    this.surfaceMesh.rotation.y += this.rotationSpeed * dt;
  }
}

