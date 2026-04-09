const KM_IN_AU = 149_597_870.7;
const KM_IN_LIGHT_SECOND = 299_792.458;

export const SCENE_UNIT_KM = 30_000;

export function sceneUnitsToKm(units: number): number {
  return Math.max(0, units) * SCENE_UNIT_KM;
}

export function formatDistance(units: number): string {
  const km = sceneUnitsToKm(units);
  const au = km / KM_IN_AU;
  const ls = km / KM_IN_LIGHT_SECOND;

  if (km < 100_000) {
    return `${km.toFixed(0)} km`;
  }

  if (km < 10_000_000) {
    return `${(km / 1_000_000).toFixed(2)} million km`;
  }

  return `${au.toFixed(3)} AU (${ls.toFixed(1)} ls)`;
}

export function formatSpeed(unitsPerSecond: number): string {
  const kmps = unitsPerSecond * SCENE_UNIT_KM;
  const lsps = kmps / KM_IN_LIGHT_SECOND;

  if (kmps < 100_000) {
    return `${kmps.toFixed(0)} km/s`;
  }

  return `${(kmps / 1_000_000).toFixed(2)}M km/s (${lsps.toFixed(2)} ls/s)`;
}
