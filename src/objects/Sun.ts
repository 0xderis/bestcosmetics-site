import * as THREE from 'three';
import { clamp } from '../utils/math';

interface SunOptions {
  radius?: number;
  name?: string;
}

const SUN_SURFACE_VERTEX = `
  varying vec3 vNormalW;
  varying vec3 vWorldPos;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const SUN_SURFACE_FRAGMENT = `
  uniform float uTime;

  varying vec3 vNormalW;
  varying vec3 vWorldPos;
  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) +
           (c - a) * u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.07;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float r = length(uv);

    vec2 flowA = vUv * 5.0 + vec2(uTime * 0.06, -uTime * 0.03);
    vec2 flowB = vUv * 8.0 + vec2(-uTime * 0.04, uTime * 0.05);

    float plasma = fbm(flowA) * 0.7 + fbm(flowB) * 0.5;
    float banding = 0.5 + 0.5 * sin((uv.x * 16.0 + uTime * 1.4) + (uv.y * 11.0 - uTime * 1.1));
    float flicker = 0.9 + 0.1 * sin(uTime * 5.0 + plasma * 6.0);

    float intensity = plasma * 0.7 + banding * 0.3;
    intensity *= flicker;

    vec3 core = vec3(1.0, 0.96, 0.86);
    vec3 mid = vec3(1.0, 0.71, 0.28);
    vec3 edge = vec3(1.0, 0.35, 0.08);

    vec3 color = mix(mid, core, smoothstep(0.45, 0.9, intensity));
    color = mix(edge, color, smoothstep(0.18, 0.95, 1.0 - r));

    float limbDarken = smoothstep(1.03, 0.48, r);
    color *= limbDarken * 1.25;

    gl_FragColor = vec4(color, 1.0);
  }
`;

const SUN_CORONA_VERTEX = `
  varying vec3 vWorldPos;
  varying vec3 vNormalW;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const SUN_CORONA_FRAGMENT = `
  uniform float uTime;
  uniform float uStrength;
  uniform vec3 uColor;

  varying vec3 vWorldPos;
  varying vec3 vNormalW;
  varying vec2 vUv;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float rim = 1.0 - max(dot(vNormalW, viewDir), 0.0);

    vec2 p = vUv * 2.0 - 1.0;
    float angle = atan(p.y, p.x);
    float radial = length(p);

    float flame = 0.5 + 0.5 * sin(angle * 16.0 + uTime * 2.4 + radial * 18.0);
    float wobble = 0.7 + 0.3 * sin(angle * 11.0 - uTime * 1.8);

    float glow = pow(rim, 2.4) * (0.5 + flame * 0.5) * wobble;
    glow *= smoothstep(1.15, 0.15, radial);

    gl_FragColor = vec4(uColor, glow * uStrength);
  }
`;

function createGlowTexture(size: number, withRays: boolean): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  const center = size * 0.5;
  const g = ctx.createRadialGradient(center, center, size * 0.08, center, center, center);
  g.addColorStop(0, 'rgba(255,246,225,0.98)');
  g.addColorStop(0.35, 'rgba(255,200,120,0.42)');
  g.addColorStop(0.75, 'rgba(255,150,60,0.12)');
  g.addColorStop(1, 'rgba(255,120,40,0.0)');

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  if (withRays) {
    ctx.translate(center, center);
    for (let i = 0; i < 18; i += 1) {
      const angle = (Math.PI * 2 * i) / 18;
      ctx.save();
      ctx.rotate(angle);
      const len = size * (0.28 + Math.random() * 0.18);
      const width = size * 0.012;
      const rayGradient = ctx.createLinearGradient(0, 0, len, 0);
      rayGradient.addColorStop(0, 'rgba(255,230,180,0.28)');
      rayGradient.addColorStop(1, 'rgba(255,180,90,0.0)');
      ctx.fillStyle = rayGradient;
      ctx.fillRect(0, -width, len, width * 2);
      ctx.restore();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export class Sun {
  readonly object = new THREE.Group();
  readonly radius: number;
  readonly name: string;

  private readonly surfaceMaterial: THREE.ShaderMaterial;
  private readonly coronaMaterial: THREE.ShaderMaterial;
  private readonly innerGlow: THREE.Sprite;
  private readonly outerGlow: THREE.Sprite;
  private readonly rayGlow: THREE.Sprite;
  private readonly tempSunPos = new THREE.Vector3();
  private time = 0;

  constructor(options?: SunOptions) {
    this.radius = options?.radius ?? 12;
    this.name = options?.name ?? 'Sun';

    this.surfaceMaterial = new THREE.ShaderMaterial({
      vertexShader: SUN_SURFACE_VERTEX,
      fragmentShader: SUN_SURFACE_FRAGMENT,
      uniforms: {
        uTime: { value: 0 }
      }
    });

    const surface = new THREE.Mesh(
      new THREE.SphereGeometry(this.radius, 128, 128),
      this.surfaceMaterial
    );
    surface.castShadow = false;
    surface.receiveShadow = false;
    this.object.add(surface);

    this.coronaMaterial = new THREE.ShaderMaterial({
      vertexShader: SUN_CORONA_VERTEX,
      fragmentShader: SUN_CORONA_FRAGMENT,
      uniforms: {
        uTime: { value: 0 },
        uStrength: { value: 0.7 },
        uColor: { value: new THREE.Color(0xffa64a) }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.BackSide
    });

    const corona = new THREE.Mesh(
      new THREE.SphereGeometry(this.radius * 1.18, 96, 96),
      this.coronaMaterial
    );
    corona.renderOrder = 2;
    this.object.add(corona);

    this.innerGlow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: createGlowTexture(512, false),
        color: 0xffcb80,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    const innerScale = this.radius * 7.5;
    this.innerGlow.scale.set(innerScale, innerScale, 1);
    this.object.add(this.innerGlow);

    this.outerGlow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: createGlowTexture(512, false),
        color: 0xff8f3c,
        transparent: true,
        opacity: 0.26,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    const outerScale = this.radius * 13.5;
    this.outerGlow.scale.set(outerScale, outerScale, 1);
    this.object.add(this.outerGlow);

    this.rayGlow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: createGlowTexture(1024, true),
        color: 0xffb162,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    const rayScale = this.radius * 18;
    this.rayGlow.scale.set(rayScale, rayScale, 1);
    this.object.add(this.rayGlow);
  }

  update(dt: number, cameraPosition: THREE.Vector3): void {
    this.time += dt;
    this.surfaceMaterial.uniforms.uTime.value = this.time;
    this.coronaMaterial.uniforms.uTime.value = this.time;

    this.object.rotation.y += dt * 0.05;
    this.rayGlow.material.rotation += dt * 0.03;

    this.object.getWorldPosition(this.tempSunPos);

    const distance = cameraPosition.distanceTo(this.tempSunPos);
    const farFactor = clamp((distance - this.radius * 2.5) / (260 - this.radius * 2.5), 0, 1);
    const nearFactor = 1 - farFactor;

    (this.innerGlow.material as THREE.SpriteMaterial).opacity = 0.35 + nearFactor * 0.26;
    (this.outerGlow.material as THREE.SpriteMaterial).opacity = 0.15 + farFactor * 0.25;
    (this.rayGlow.material as THREE.SpriteMaterial).opacity = 0.08 + farFactor * 0.26;

    const pulse = 1 + Math.sin(this.time * 1.6) * 0.03;
    const innerBase = this.radius * 7.5;
    const outerBase = this.radius * 13.5;
    const raysBase = this.radius * 18;

    this.innerGlow.scale.setScalar(innerBase * pulse);
    this.outerGlow.scale.setScalar(outerBase * (0.98 + pulse * 0.04));
    this.rayGlow.scale.setScalar(raysBase * (0.98 + farFactor * 0.12));

    this.coronaMaterial.uniforms.uStrength.value = 0.52 + nearFactor * 0.36;
  }

  getWorldPosition(target: THREE.Vector3): THREE.Vector3 {
    return this.object.getWorldPosition(target);
  }
}
