import { HudData } from '../controls/CameraController';
import { TimeHudData } from '../core/TimeController';
import { formatDistance, formatSpeed } from '../utils/units';

export class Hud {
  private readonly root: HTMLDivElement;
  private visible = true;

  constructor(container: HTMLElement) {
    this.root = document.createElement('div');
    this.root.className = 'hud';
    container.appendChild(this.root);
  }

  setVisible(visible: boolean): void {
    this.visible = visible;
    this.root.style.display = visible ? 'block' : 'none';
  }

  update(data: HudData, time: TimeHudData): void {
    if (!this.visible) return;

    const scaleDigits = time.timeScale < 1 ? 1 : 0;

    this.root.innerHTML = `
      <div class="hud__panel">
        <div class="hud__title">Solar System Navigation</div>
        <div class="hud__row"><span>Selected</span><strong>${data.selectedName} [${data.selectedSlot}/${data.selectableCount}]</strong></div>
        <div class="hud__row"><span>Distance</span><strong>${formatDistance(data.distanceToSelected)}</strong></div>
        <div class="hud__row"><span>Speed</span><strong>${formatSpeed(data.speed)}</strong></div>
        <div class="hud__row"><span>Cruise</span><strong>${formatSpeed(data.baseSpeed)}</strong></div>
        <div class="hud__row"><span>Time Scale</span><strong>x${time.timeScale.toFixed(scaleDigits)}</strong></div>
        <div class="hud__row"><span>Time Mode</span><strong>${time.timeMode}</strong></div>
        <div class="hud__row"><span>Mode</span><strong>${data.modeLabel}</strong></div>
        <div class="hud__row"><span>Status</span><strong>${data.statusLabel}</strong></div>
      </div>
      <div class="hud__help">
        <div>WASD move, Space/Ctrl up-down, Shift boost</div>
        <div>Mouse look (click lock), Wheel speed, R reset speed, Z switch mode</div>
        <div>Time: 0 pause, 1 x0.1, 2 x1, 3 x10, 4 x100, 5 x1000</div>
        <div>F focus, Enter auto approach, Space cancels auto approach, G exit focus</div>
        <div>Select: F1-F9 or Numpad 1-9 (Alt+1..9 fallback)</div>
      </div>
    `;
  }
}

