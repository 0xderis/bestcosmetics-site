import * as THREE from 'three';

export class SolarLighting {
  readonly solarDirectional: THREE.DirectionalLight;
  readonly ambientFill: THREE.AmbientLight;

  private readonly systemTarget = new THREE.Object3D();
  private readonly tempTarget = new THREE.Vector3();
  private readonly defaultCenter = new THREE.Vector3(0, 0, 0);

  constructor(scene: THREE.Scene) {
    this.solarDirectional = new THREE.DirectionalLight(0xfff2d8, 1.75);
    this.solarDirectional.castShadow = true;
    this.solarDirectional.shadow.mapSize.set(2048, 2048);
    this.solarDirectional.shadow.bias = -0.00015;
    this.solarDirectional.shadow.normalBias = 0.02;
    this.solarDirectional.shadow.camera.near = 1;
    this.solarDirectional.shadow.camera.far = 800;

    const shadowCam = this.solarDirectional.shadow.camera as THREE.OrthographicCamera;
    shadowCam.left = -220;
    shadowCam.right = 220;
    shadowCam.top = 220;
    shadowCam.bottom = -220;
    shadowCam.updateProjectionMatrix();

    this.solarDirectional.target = this.systemTarget;

    scene.add(this.systemTarget);
    scene.add(this.solarDirectional);

    this.ambientFill = new THREE.AmbientLight(0x31445a, 0.035);
    scene.add(this.ambientFill);
  }

  update(sunPosition: THREE.Vector3, systemCenter?: THREE.Vector3): void {
    this.solarDirectional.position.copy(sunPosition);

    this.tempTarget.copy(systemCenter ?? this.defaultCenter);
    if (this.tempTarget.distanceToSquared(sunPosition) < 0.0001) {
      this.tempTarget.x += 1;
    }

    this.systemTarget.position.copy(this.tempTarget);
    this.systemTarget.updateMatrixWorld();
    this.solarDirectional.target.updateMatrixWorld();
  }
}
