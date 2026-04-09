import * as THREE from 'three';
import { clamp } from '../utils/math';

export type FlightMode = 'free' | 'plane';
export type FlightStatus = 'manual' | 'focus' | 'auto';

export interface Selectable {
  name: string;
  radius: number;
  object: THREE.Object3D;
}

export interface HudData {
  selectedName: string;
  selectedSlot: number;
  selectableCount: number;
  distanceToSelected: number;
  speed: number;
  modeLabel: string;
  statusLabel: string;
  baseSpeed: number;
  hudVisible: boolean;
}

export class CameraController {
  private readonly keys = new Set<string>();
  private readonly velocity = new THREE.Vector3();
  private readonly desiredVelocity = new THREE.Vector3();
  private readonly forward = new THREE.Vector3();
  private readonly right = new THREE.Vector3();
  private readonly worldUp = new THREE.Vector3(0, 1, 0);
  private readonly upVector = new THREE.Vector3();
  private readonly tempSelectedPos = new THREE.Vector3();
  private readonly tempTargetWorld = new THREE.Vector3();
  private readonly tempDirection = new THREE.Vector3();

  private yaw = 0;
  private pitch = 0;
  private pointerLocked = false;

  private mode: FlightMode = 'free';
  private status: FlightStatus = 'manual';
  private selectedIndex = 0;

  private baseSpeed = 8;
  private readonly baseSpeedDefault = 8;
  private readonly baseSpeedMin = 1;
  private readonly baseSpeedMax = 120;
  private readonly boostMultiplier = 2.3;
  private readonly damping = 7.4;
  private readonly worldRadiusLimit: number;

  private focusTarget: Selectable | null = null;
  private focusDistance = 0;
  private focusMoving = false;

  private hudVisible = true;

  constructor(
    private camera: THREE.PerspectiveCamera,
    private domElement: HTMLElement,
    private selectables: Selectable[],
    private onToggleHud?: (visible: boolean) => void,
    worldRadiusLimit = 335
  ) {
    const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ');
    this.yaw = euler.y;
    this.pitch = euler.x;
    this.worldRadiusLimit = worldRadiusLimit;

    this.bindEvents();
  }

  private bindEvents(): void {
    this.domElement.addEventListener('click', () => {
      if (!this.pointerLocked) {
        this.domElement.requestPointerLock();
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.pointerLocked = document.pointerLockElement === this.domElement;
    });

    document.addEventListener('mousemove', (event) => {
      if (!this.pointerLocked) return;
      const sensitivity = 0.0018;
      this.yaw -= event.movementX * sensitivity;
      this.pitch -= event.movementY * sensitivity;
      const limit = Math.PI / 2 - 0.02;
      this.pitch = clamp(this.pitch, -limit, limit);

      const rotation = new THREE.Euler(this.pitch, this.yaw, 0, 'YXZ');
      this.camera.quaternion.setFromEuler(rotation);
    });

    document.addEventListener('keydown', (event) => this.handleKeyDown(event));
    document.addEventListener('keyup', (event) => this.handleKeyUp(event));

    this.domElement.addEventListener('wheel', (event) => {
      event.preventDefault();
      const delta = event.deltaY < 0 ? 1.12 : 0.88;
      this.baseSpeed = clamp(this.baseSpeed * delta, this.baseSpeedMin, this.baseSpeedMax);
    });
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const code = event.code;

    if (code === 'KeyZ') this.toggleMode();
    if (code === 'KeyR') this.baseSpeed = this.baseSpeedDefault;
    if (code === 'KeyF') this.beginFocus();
    if (code === 'KeyG') this.endFocus();
    if (code === 'Enter') this.beginAutoApproach();

    if (code === 'KeyH') {
      this.hudVisible = !this.hudVisible;
      this.onToggleHud?.(this.hudVisible);
    }

    this.handleSelectionShortcut(event);

    if (code === 'Space' && this.status === 'auto') {
      this.cancelAutoApproach();
      event.preventDefault();
      return;
    }

    if (this.isMovementKey(code)) {
      event.preventDefault();
    }

    this.keys.add(code);
  }

  private handleSelectionShortcut(event: KeyboardEvent): void {
    const digitFromNumpad = this.extractIndex(event.code, 'Numpad');
    if (digitFromNumpad !== null) {
      this.select(digitFromNumpad);
      event.preventDefault();
      return;
    }

    const digitFromFunctionKey = this.extractIndex(event.code, 'F');
    if (digitFromFunctionKey !== null) {
      this.select(digitFromFunctionKey);
      event.preventDefault();
      return;
    }

    if (event.altKey) {
      const digitFromTopRow = this.extractIndex(event.code, 'Digit');
      if (digitFromTopRow !== null) {
        this.select(digitFromTopRow);
        event.preventDefault();
      }
    }
  }

  private extractIndex(code: string, prefix: string): number | null {
    if (!code.startsWith(prefix)) {
      return null;
    }

    const digit = Number(code.replace(prefix, ''));
    if (!Number.isInteger(digit) || digit < 1 || digit > this.selectables.length) {
      return null;
    }

    return digit - 1;
  }

  private handleKeyUp(event: KeyboardEvent): void {
    this.keys.delete(event.code);
  }

  private isMovementKey(code: string): boolean {
    return (
      code === 'KeyW' ||
      code === 'KeyA' ||
      code === 'KeyS' ||
      code === 'KeyD' ||
      code === 'Space' ||
      code === 'ControlLeft' ||
      code === 'ControlRight' ||
      code === 'ShiftLeft' ||
      code === 'ShiftRight'
    );
  }

  private toggleMode(): void {
    this.mode = this.mode === 'free' ? 'plane' : 'free';
  }

  private select(index: number): void {
    if (index >= 0 && index < this.selectables.length) {
      this.selectedIndex = index;
    }
  }

  private beginFocus(): void {
    const selected = this.selectables[this.selectedIndex];
    if (!selected) return;

    this.focusTarget = selected;
    this.focusDistance = this.getSafeDistance(selected.radius);
    this.status = 'focus';
    this.focusMoving = true;
    this.velocity.set(0, 0, 0);
  }

  private endFocus(): void {
    if (this.status === 'focus') {
      this.status = 'manual';
      this.focusMoving = false;
    }
  }

  private beginAutoApproach(): void {
    const selected = this.selectables[this.selectedIndex];
    if (!selected) return;

    this.focusTarget = selected;
    this.focusDistance = this.getSafeDistance(selected.radius);
    this.status = 'auto';
    this.focusMoving = true;
    this.velocity.set(0, 0, 0);
  }

  private cancelAutoApproach(): void {
    if (this.status === 'auto') {
      this.status = 'manual';
      this.focusMoving = false;
    }
  }

  private getSafeDistance(radius: number): number {
    return clamp(radius * 2.9 + 2.2, 4.8, 44);
  }

  update(dt: number): void {
    if (this.status === 'auto') {
      if (this.hasManualInput()) {
        this.cancelAutoApproach();
      } else {
        this.updateAutoApproach(dt);
      }
      this.enforceWorldBoundary();
      return;
    }

    if (this.status === 'focus') {
      if (this.focusMoving) {
        this.updateFocusMove(dt);
      }
      this.enforceWorldBoundary();
      return;
    }

    this.updateManual(dt);
    this.enforceWorldBoundary();
  }

  private updateManual(dt: number): void {
    this.desiredVelocity.set(0, 0, 0);

    const forward = this.getForwardVector();
    const right = this.getRightVector();
    const up = this.mode === 'free' ? this.getUpVector() : this.worldUp;

    if (this.keys.has('KeyW')) this.desiredVelocity.add(forward);
    if (this.keys.has('KeyS')) this.desiredVelocity.addScaledVector(forward, -1);
    if (this.keys.has('KeyD')) this.desiredVelocity.add(right);
    if (this.keys.has('KeyA')) this.desiredVelocity.addScaledVector(right, -1);
    if (this.keys.has('Space')) this.desiredVelocity.add(up);
    if (this.keys.has('ControlLeft') || this.keys.has('ControlRight')) {
      this.desiredVelocity.addScaledVector(up, -1);
    }

    const speedBoost =
      this.keys.has('ShiftLeft') || this.keys.has('ShiftRight') ? this.boostMultiplier : 1;
    const speed = this.baseSpeed * speedBoost;

    if (this.desiredVelocity.lengthSq() > 0) {
      this.desiredVelocity.normalize().multiplyScalar(speed);
    }

    const blend = 1 - Math.exp(-this.damping * dt);
    this.velocity.lerp(this.desiredVelocity, blend);
    this.camera.position.addScaledVector(this.velocity, dt);
  }

  private updateFocusMove(dt: number): void {
    if (!this.focusTarget) return;

    const targetPos = this.getFocusPosition(this.focusTarget);
    this.smoothMoveTo(targetPos, dt, 3.8);

    const dist = this.camera.position.distanceTo(targetPos);
    if (dist < 0.45) {
      this.focusMoving = false;
    }
  }

  private updateAutoApproach(dt: number): void {
    if (!this.focusTarget) return;

    const targetPos = this.getFocusPosition(this.focusTarget);
    this.smoothMoveTo(targetPos, dt, 5.2);

    const distToTarget = this.camera.position.distanceTo(targetPos);
    if (distToTarget < 0.55) {
      this.status = 'focus';
      this.focusMoving = false;
    }
  }

  private smoothMoveTo(targetPos: THREE.Vector3, dt: number, speed = 4.2): void {
    const blend = 1 - Math.exp(-speed * dt);
    this.camera.position.lerp(targetPos, blend);
  }

  private getFocusPosition(target: Selectable): THREE.Vector3 {
    target.object.getWorldPosition(this.tempTargetWorld);

    this.tempDirection.subVectors(this.camera.position, this.tempTargetWorld);
    if (this.tempDirection.lengthSq() < 0.001) {
      this.tempDirection.set(0, 0, 1);
    }

    this.tempDirection.normalize();
    return this.tempTargetWorld.clone().addScaledVector(this.tempDirection, this.focusDistance);
  }

  private hasManualInput(): boolean {
    return (
      this.keys.has('KeyW') ||
      this.keys.has('KeyA') ||
      this.keys.has('KeyS') ||
      this.keys.has('KeyD') ||
      this.keys.has('Space') ||
      this.keys.has('ControlLeft') ||
      this.keys.has('ControlRight')
    );
  }

  private getForwardVector(): THREE.Vector3 {
    this.forward.set(0, 0, -1).applyQuaternion(this.camera.quaternion);

    if (this.mode === 'plane') {
      this.forward.y = 0;
      if (this.forward.lengthSq() < 0.001) {
        this.forward.set(0, 0, -1);
      }
      this.forward.normalize();
    }

    return this.forward;
  }

  private getRightVector(): THREE.Vector3 {
    this.right.set(1, 0, 0).applyQuaternion(this.camera.quaternion);

    if (this.mode === 'plane') {
      this.right.y = 0;
      if (this.right.lengthSq() < 0.001) {
        this.right.set(1, 0, 0);
      }
      this.right.normalize();
    }

    return this.right;
  }

  private getUpVector(): THREE.Vector3 {
    this.upVector.set(0, 1, 0).applyQuaternion(this.camera.quaternion);
    return this.upVector;
  }

  private enforceWorldBoundary(): void {
    const distanceFromOrigin = this.camera.position.length();
    if (distanceFromOrigin <= this.worldRadiusLimit) return;

    this.camera.position.multiplyScalar(this.worldRadiusLimit / distanceFromOrigin);
    this.velocity.multiplyScalar(0.2);
  }

  getHudData(): HudData {
    const selected = this.selectables[this.selectedIndex];
    const selectedName = selected?.name ?? 'None';
    const distance = selected ? this.getDistanceToSelected(selected) : 0;

    return {
      selectedName,
      selectedSlot: this.selectedIndex + 1,
      selectableCount: this.selectables.length,
      distanceToSelected: distance,
      speed: this.velocity.length(),
      modeLabel: this.mode === 'free' ? 'Free Flight' : 'Plane Assist Flight',
      statusLabel:
        this.status === 'manual' ? 'Manual' : this.status === 'focus' ? 'Focus' : 'Auto Approach',
      baseSpeed: this.baseSpeed,
      hudVisible: this.hudVisible
    };
  }

  private getDistanceToSelected(selected: Selectable): number {
    selected.object.getWorldPosition(this.tempSelectedPos);
    return this.camera.position.distanceTo(this.tempSelectedPos);
  }
}
