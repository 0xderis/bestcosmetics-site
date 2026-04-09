import * as THREE from 'three';
import { Earth } from './Earth';

export interface EarthPlanetOptions {
  orbitRadius: number;
  orbitSpeed: number;
  axialTiltDeg?: number;
  orbitInclinationDeg?: number;
}

export class EarthPlanet {
  readonly name = 'Earth';
  readonly object = new THREE.Group();
  readonly radius: number;

  private readonly earth: Earth;
  private readonly spinRoot = new THREE.Group();
  private orbitAngle = Math.random() * Math.PI * 2;
  private readonly orbitRadius: number;
  private readonly orbitSpeed: number;
  private readonly orbitInclinationRad: number;

  private constructor(earth: Earth, options: EarthPlanetOptions) {
    this.earth = earth;
    this.radius = earth.radius;
    this.orbitRadius = options.orbitRadius;
    this.orbitSpeed = options.orbitSpeed;
    this.orbitInclinationRad = THREE.MathUtils.degToRad(options.orbitInclinationDeg ?? 0.2);

    this.spinRoot.rotation.z = THREE.MathUtils.degToRad(options.axialTiltDeg ?? 23.4);
    this.spinRoot.add(earth.object);
    this.object.add(this.spinRoot);
  }

  static async create(
    renderer: THREE.WebGLRenderer,
    options: EarthPlanetOptions,
    earthOptions?: {
      radius?: number;
      rotationSpeed?: number;
      cloudRotationSpeed?: number;
    }
  ): Promise<EarthPlanet> {
    const earth = await Earth.create(renderer, {
      radius: earthOptions?.radius ?? 2.15,
      rotationSpeed: earthOptions?.rotationSpeed ?? 0.52,
      cloudRotationSpeed: earthOptions?.cloudRotationSpeed ?? 0.68,
      texturePaths: {
        day: '/textures/earth_day_2k.jpg',
        normal: '/textures/earth_normal_2k.jpg',
        specular: '/textures/earth_specular_2k.jpg',
        clouds: '/textures/earth_clouds_1k.png',
        night: '/textures/earth_night_2k.png'
      }
    });

    return new EarthPlanet(earth, options);
  }

  update(dt: number): void {
    this.orbitAngle += this.orbitSpeed * dt;

    const x = Math.cos(this.orbitAngle) * this.orbitRadius;
    const z = Math.sin(this.orbitAngle) * this.orbitRadius;
    const y = Math.sin(this.orbitAngle * 0.9) * this.orbitRadius * Math.sin(this.orbitInclinationRad);

    this.object.position.set(x, y, z);
    this.earth.update(dt);
  }

  getEarthModel(): Earth {
    return this.earth;
  }
}
