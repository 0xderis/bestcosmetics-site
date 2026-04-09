import * as THREE from 'three';

export interface LoopFrame {
  realDelta: number;
  simulationDelta: number;
  timeScale: number;
}

export type LoopCallback = (frame: LoopFrame) => void;

export class Loop {
  private callbacks: LoopCallback[] = [];
  private running = false;
  private lastTime = 0;
  private timeScaleProvider: () => number = () => 1;

  constructor(
    private renderer: THREE.WebGLRenderer,
    private scene: THREE.Scene,
    private camera: THREE.Camera
  ) {}

  add(callback: LoopCallback): void {
    this.callbacks.push(callback);
  }

  setTimeScaleProvider(provider: () => number): void {
    this.timeScaleProvider = provider;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.tick);
  }

  stop(): void {
    this.running = false;
  }

  private tick = (time: number): void => {
    if (!this.running) return;

    const realDelta = Math.min((time - this.lastTime) / 1000, 0.033);
    this.lastTime = time;
    const timeScale = Math.max(0, this.timeScaleProvider());
    const simulationDelta = realDelta * timeScale;
    const frame: LoopFrame = { realDelta, simulationDelta, timeScale };

    for (const callback of this.callbacks) {
      callback(frame);
    }

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.tick);
  };
}

