import * as THREE from 'three';
import { clamp, damp } from '../utils/math';

function wrapAngle(value: number): number {
  const twoPi = Math.PI * 2;
  let wrapped = value % twoPi;
  if (wrapped < 0) wrapped += twoPi;
  return wrapped;
}

function dampAngle(current: number, target: number, lambda: number, dt: number): number {
  const twoPi = Math.PI * 2;
  let delta = (target - current) % twoPi;
  if (delta > Math.PI) delta -= twoPi;
  if (delta < -Math.PI) delta += twoPi;
  return current + delta * (1 - Math.exp(-lambda * dt));
}

export class EarthCameraController {
  private isDragging = false;
  private lastPointerX = 0;
  private lastPointerY = 0;

  private readonly pressedKeys = new Set<string>();

  private targetAzimuth = Math.PI * 0.18;
  private targetPolar = Math.PI * 0.42;
  private azimuth = this.targetAzimuth;
  private polar = this.targetPolar;

  private targetDistance: number;
  private distance: number;
  private readonly minDistance: number;
  private readonly maxDistance: number;

  private readonly target = new THREE.Vector3(0, 0, 0);
  private readonly offset = new THREE.Vector3();

  constructor(
    private readonly camera: THREE.PerspectiveCamera,
    private readonly domElement: HTMLElement,
    earthRadius: number
  ) {
    this.minDistance = earthRadius * 1.2;
    this.maxDistance = earthRadius * 26;
    this.targetDistance = earthRadius * 5.2;
    this.distance = this.targetDistance;

    this.bindEvents();
    this.update(0);
  }

  private bindEvents(): void {
    this.domElement.addEventListener('mousedown', (event) => {
      if (event.button !== 0) return;
      this.isDragging = true;
      this.lastPointerX = event.clientX;
      this.lastPointerY = event.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('mousemove', (event) => {
      if (!this.isDragging) return;

      const deltaX = event.clientX - this.lastPointerX;
      const deltaY = event.clientY - this.lastPointerY;
      this.lastPointerX = event.clientX;
      this.lastPointerY = event.clientY;

      const rotationSpeed = 0.004;
      this.targetAzimuth = wrapAngle(this.targetAzimuth - deltaX * rotationSpeed);
      this.targetPolar = clamp(this.targetPolar + deltaY * rotationSpeed, 0.09, Math.PI - 0.09);
    });

    this.domElement.addEventListener('wheel', (event) => {
      event.preventDefault();
      const zoomFactor = Math.exp(event.deltaY * 0.0012);
      this.targetDistance = clamp(this.targetDistance * zoomFactor, this.minDistance, this.maxDistance);
    });

    window.addEventListener('keydown', (event) => {
      if (event.code === 'KeyF') {
        this.focusNearOrbit();
      }
      this.pressedKeys.add(event.code);
    });

    window.addEventListener('keyup', (event) => {
      this.pressedKeys.delete(event.code);
    });
  }

  update(dt: number): void {
    this.updateKeyboardZoom(dt);

    this.distance = damp(this.distance, this.targetDistance, 7.2, dt);
    this.azimuth = dampAngle(this.azimuth, this.targetAzimuth, 12.0, dt);
    this.polar = damp(this.polar, this.targetPolar, 12.0, dt);

    const sinPolar = Math.sin(this.polar);

    this.offset.set(
      this.distance * sinPolar * Math.sin(this.azimuth),
      this.distance * Math.cos(this.polar),
      this.distance * sinPolar * Math.cos(this.azimuth)
    );

    this.camera.position.copy(this.target).add(this.offset);
    this.camera.lookAt(this.target);
  }

  private updateKeyboardZoom(dt: number): void {
    const zoomStep = Math.max(this.targetDistance * 0.9, 0.1);

    if (this.pressedKeys.has('KeyW')) {
      this.targetDistance -= zoomStep * dt;
    }

    if (this.pressedKeys.has('KeyS')) {
      this.targetDistance += zoomStep * dt;
    }

    this.targetDistance = clamp(this.targetDistance, this.minDistance, this.maxDistance);
  }

  focusNearOrbit(): void {
    this.targetDistance = this.minDistance * 1.18;
  }

  getDistanceToCenter(): number {
    return this.distance;
  }

  getAltitude(earthRadius: number): number {
    return Math.max(this.distance - earthRadius, 0);
  }
}
