import { clamp } from '../utils/math';

export interface TimeHudData {
  timeScale: number;
  timeMode: string;
}

const TIME_PRESETS: Record<string, number> = {
  Digit0: 0,
  Digit1: 0.1,
  Digit2: 1,
  Digit3: 10,
  Digit4: 100,
  Digit5: 1000
};

export class TimeController {
  private timeScale = 10;

  constructor(private readonly target: Document = document) {
    this.target.addEventListener('keydown', this.handleKeyDown);
  }

  dispose(): void {
    this.target.removeEventListener('keydown', this.handleKeyDown);
  }

  getTimeScale(): number {
    return this.timeScale;
  }

  setTimeScale(value: number): void {
    this.timeScale = clamp(value, 0, 1000);
  }

  getSimulationDelta(realDelta: number): number {
    return realDelta * this.timeScale;
  }

  getHudData(): TimeHudData {
    return {
      timeScale: this.timeScale,
      timeMode: this.getModeLabel()
    };
  }

  private getModeLabel(): string {
    if (this.timeScale === 0) {
      return 'Paused';
    }

    if (this.timeScale <= 1) {
      return 'Slow';
    }

    if (this.timeScale <= 10) {
      return 'Normal';
    }

    return 'Fast';
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.altKey) {
      return;
    }

    const preset = TIME_PRESETS[event.code];
    if (preset === undefined) {
      return;
    }

    this.setTimeScale(preset);
    event.preventDefault();
  };
}
