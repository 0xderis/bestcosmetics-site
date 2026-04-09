import * as THREE from 'three';
import { clamp } from '../utils/math';

export interface EarthTexturePaths {
  day: string;
  normal: string;
  specular: string;
  clouds: string;
  night: string;
}

export interface AtmosphereSettings {
  intensity: number;
  power: number;
  alpha: number;
}

export interface EarthOptions {
  radius?: number;
  rotationSpeed?: number;
  cloudRotationSpeed?: number;
  texturePaths?: EarthTexturePaths;
}

const DEFAULT_TEXTURE_PATHS: EarthTexturePaths = {
  day: '/textures/earth_day_2k.jpg',
  normal: '/textures/earth_normal_2k.jpg',
  specular: '/textures/earth_specular_2k.jpg',
  clouds: '/textures/earth_clouds_1k.png',
  night: '/textures/earth_night_2k.png'
};

const ATMOSPHERE_VERTEX_SHADER = `
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const ATMOSPHERE_FRAGMENT_SHADER = `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uPower;
  uniform float uAlpha;
  uniform vec3 uSunDirection;

  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float rim = 1.0 - max(dot(vWorldNormal, viewDirection), 0.0);
    vec3 sunDir = normalize(uSunDirection);
    float sunFacing = max(dot(vWorldNormal, sunDir), 0.0);
    float terminator = 1.0 - abs(dot(vWorldNormal, sunDir));
    float sunlightBoost = mix(0.14, 1.0, pow(sunFacing, 0.55));
    float horizonBoost = 0.25 + pow(max(terminator, 0.0), 2.2) * 0.95;
    float glow = pow(rim, uPower) * uIntensity * sunlightBoost * horizonBoost;
    gl_FragColor = vec4(uColor, glow * uAlpha);
  }
`;

function loadTexture(loader: THREE.TextureLoader, path: string): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    loader.load(path, resolve, undefined, reject);
  });
}

function createRoughnessFromSpecular(specularTexture: THREE.Texture): THREE.CanvasTexture {
  const image = specularTexture.image as HTMLImageElement;
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context is unavailable');
  }

  ctx.drawImage(image, 0, 0);

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const luminance = data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722;
    const roughness = 255 - luminance;
    data[i] = roughness;
    data[i + 1] = roughness;
    data[i + 2] = roughness;
    data[i + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);

  const roughnessTexture = new THREE.CanvasTexture(canvas);
  roughnessTexture.wrapS = THREE.RepeatWrapping;
  roughnessTexture.wrapT = THREE.RepeatWrapping;
  roughnessTexture.needsUpdate = true;

  return roughnessTexture;
}

export class Earth {
  readonly object = new THREE.Group();
  readonly radius: number;

  private readonly surfaceMesh: THREE.Mesh;
  private readonly cloudMesh: THREE.Mesh;
  private readonly atmosphereMesh: THREE.Mesh;
  private readonly atmosphereMaterial: THREE.ShaderMaterial;
  private readonly rotationSpeed: number;
  private readonly cloudRotationSpeed: number;

  private constructor(
    radius: number,
    rotationSpeed: number,
    cloudRotationSpeed: number,
    surfaceMesh: THREE.Mesh,
    cloudMesh: THREE.Mesh,
    atmosphereMesh: THREE.Mesh,
    atmosphereMaterial: THREE.ShaderMaterial
  ) {
    this.radius = radius;
    this.rotationSpeed = rotationSpeed;
    this.cloudRotationSpeed = cloudRotationSpeed;
    this.surfaceMesh = surfaceMesh;
    this.cloudMesh = cloudMesh;
    this.atmosphereMesh = atmosphereMesh;
    this.atmosphereMaterial = atmosphereMaterial;

    this.object.add(this.surfaceMesh);
    this.object.add(this.cloudMesh);
    this.object.add(this.atmosphereMesh);
  }

  static async create(renderer: THREE.WebGLRenderer, options?: EarthOptions): Promise<Earth> {
    const radius = options?.radius ?? 6.4;
    const rotationSpeed = options?.rotationSpeed ?? 0.11;
    const cloudRotationSpeed = options?.cloudRotationSpeed ?? 0.135;
    const texturePaths = options?.texturePaths ?? DEFAULT_TEXTURE_PATHS;

    const loader = new THREE.TextureLoader();

    const [dayTexture, normalTexture, specularTexture, cloudTexture, nightTexture] = await Promise.all([
      loadTexture(loader, texturePaths.day),
      loadTexture(loader, texturePaths.normal),
      loadTexture(loader, texturePaths.specular),
      loadTexture(loader, texturePaths.clouds),
      loadTexture(loader, texturePaths.night)
    ]);

    dayTexture.colorSpace = THREE.SRGBColorSpace;
    cloudTexture.colorSpace = THREE.SRGBColorSpace;
    nightTexture.colorSpace = THREE.SRGBColorSpace;

    const anisotropy = renderer.capabilities.getMaxAnisotropy();
    dayTexture.anisotropy = anisotropy;
    normalTexture.anisotropy = anisotropy;
    specularTexture.anisotropy = anisotropy;
    cloudTexture.anisotropy = anisotropy;
    nightTexture.anisotropy = anisotropy;

    const roughnessTexture = createRoughnessFromSpecular(specularTexture);
    roughnessTexture.anisotropy = anisotropy;

    const earthGeometry = new THREE.SphereGeometry(radius, 160, 160);
    const surfaceMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf5f9ff,
      map: dayTexture,
      normalMap: normalTexture,
      normalScale: new THREE.Vector2(1.0, 1.0),
      roughnessMap: roughnessTexture,
      roughness: 0.78,
      metalness: 0.01,
      clearcoat: 0.38,
      clearcoatRoughness: 0.24,
      ior: 1.33,
      metalnessMap: specularTexture,
      emissive: 0x1b2b3f,
      emissiveMap: nightTexture,
      emissiveIntensity: 0.26
    });

    const surfaceMesh = new THREE.Mesh(earthGeometry, surfaceMaterial);
    surfaceMesh.castShadow = true;
    surfaceMesh.receiveShadow = true;

    const cloudGeometry = new THREE.SphereGeometry(radius * 1.013, 128, 128);
    const cloudMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: cloudTexture,
      alphaMap: cloudTexture,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      roughness: 0.68,
      metalness: 0
    });
    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    cloudMesh.castShadow = false;
    cloudMesh.receiveShadow = false;

    const atmosphereGeometry = new THREE.SphereGeometry(radius * 1.03, 128, 128);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(0xcfe6ff) },
        uIntensity: { value: 0.42 },
        uPower: { value: 4.0 },
        uAlpha: { value: 0.24 },
        uSunDirection: { value: new THREE.Vector3(1, 0, 0) }
      },
      vertexShader: ATMOSPHERE_VERTEX_SHADER,
      fragmentShader: ATMOSPHERE_FRAGMENT_SHADER,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.BackSide
    });

    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    atmosphereMesh.castShadow = false;
    atmosphereMesh.receiveShadow = false;

    return new Earth(
      radius,
      rotationSpeed,
      cloudRotationSpeed,
      surfaceMesh,
      cloudMesh,
      atmosphereMesh,
      atmosphereMaterial
    );
  }

  update(dt: number): void {
    this.surfaceMesh.rotation.y += this.rotationSpeed * dt;
    this.cloudMesh.rotation.y += this.cloudRotationSpeed * dt;
  }

  setAtmosphere(settings: AtmosphereSettings): void {
    this.atmosphereMaterial.uniforms.uIntensity.value = clamp(settings.intensity, 0.1, 3.0);
    this.atmosphereMaterial.uniforms.uPower.value = clamp(settings.power, 0.5, 5.0);
    this.atmosphereMaterial.uniforms.uAlpha.value = clamp(settings.alpha, 0.02, 1.0);
  }

  setCloudOpacity(opacity: number): void {
    const material = this.cloudMesh.material as THREE.MeshStandardMaterial;
    material.opacity = clamp(opacity, 0.15, 0.92);
  }

  setSunDirection(direction: THREE.Vector3): void {
    if (direction.lengthSq() < 0.0001) {
      return;
    }

    this.atmosphereMaterial.uniforms.uSunDirection.value.copy(direction).normalize();
  }
}
