import * as THREE from 'three';
import { clamp, lerp } from '../utils/math';
import { Earth } from '../objects/Earth';

export class AtmosphereEntryEffect {
  private readonly fogColor = new THREE.Color(0xcfe6ff);
  private readonly nearThreshold: number;
  private readonly farThreshold: number;

  constructor(private readonly scene: THREE.Scene, private readonly earth: Earth) {
    this.nearThreshold = this.earth.radius * 1.24;
    this.farThreshold = this.earth.radius * 7.2;
    this.scene.fog = new THREE.FogExp2(this.fogColor, 0.0);
  }

  update(distanceToCenter: number): void {
    const t = clamp(
      1 - (distanceToCenter - this.nearThreshold) / (this.farThreshold - this.nearThreshold),
      0,
      1
    );

    this.earth.setAtmosphere({
      intensity: lerp(0.28, 0.92, t),
      power: lerp(4.3, 2.8, t),
      alpha: lerp(0.12, 0.34, t)
    });

    this.earth.setCloudOpacity(lerp(0.74, 0.86, t));

    const fog = this.scene.fog;
    if (fog instanceof THREE.FogExp2) {
      fog.density = lerp(0.0, 0.0045, Math.pow(t, 1.7));
    }
  }
}
