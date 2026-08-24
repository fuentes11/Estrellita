import { Body, DefineStar, Equator, Horizon, Observer } from 'astronomy-engine'

export const POLARIS = {
  displayName: 'Estrellita',
  catalogName: 'Polaris · α Ursae Minoris',
  hip: 'HIP 11767',
  constellation: 'Ursa Minor',
  raJ2000: 2 + 31 / 60 + 49.09 / 3600,
  decJ2000: 89 + 15 / 60 + 50.8 / 3600,
  distanceLightYears: 447.6,
  magnitude: 1.98
} as const

DefineStar(Body.Star1, POLARIS.raJ2000, POLARIS.decJ2000, POLARIS.distanceLightYears)

export type SkyPosition = {
  azimuth: number
  altitude: number
  sunAltitude: number
  cardinal: string
  darkness: 'día' | 'crepúsculo' | 'noche' | 'noche profunda'
}

export function getSkyPosition(latitude: number, longitude: number, date = new Date()): SkyPosition {
  const observer = new Observer(latitude, longitude, 0)

  const starEq = Equator(Body.Star1, date, observer, true, true)
  const starHorizon = Horizon(date, observer, starEq.ra, starEq.dec, 'normal')

  const sunEq = Equator(Body.Sun, date, observer, true, true)
  const sunHorizon = Horizon(date, observer, sunEq.ra, sunEq.dec, 'normal')

  return {
    azimuth: normalizeDegrees(starHorizon.azimuth),
    altitude: starHorizon.altitude,
    sunAltitude: sunHorizon.altitude,
    cardinal: toCardinal(starHorizon.azimuth),
    darkness: getDarknessLabel(sunHorizon.altitude)
  }
}

export function getViewingScore(position: SkyPosition, cloudCover?: number | null) {
  let score = 100
  const reasons: string[] = []

  if (position.sunAltitude > -6) {
    score -= 75
    reasons.push('Todavía hay demasiada luz del Sol.')
  } else if (position.sunAltitude > -12) {
    score -= 35
    reasons.push('Aún queda algo de luz de crepúsculo.')
  } else if (position.sunAltitude > -18) {
    score -= 12
    reasons.push('El cielo ya está bastante oscuro.')
  } else {
    reasons.push('La oscuridad es muy buena para observar.')
  }

  if (position.altitude < 8) {
    score -= 35
    reasons.push('Estrellita está muy baja: edificios o árboles pueden taparla.')
  } else if (position.altitude < 18) {
    score -= 18
    reasons.push('Estrellita está baja sobre el horizonte; busca una vista despejada al norte.')
  } else {
    reasons.push('Estrellita tiene una altura cómoda sobre el horizonte.')
  }

  if (typeof cloudCover === 'number') {
    score -= cloudCover * 0.55
    if (cloudCover < 25) reasons.push('Hay pocas nubes.')
    else if (cloudCover < 60) reasons.push('Hay nubes parciales.')
    else reasons.push('La nubosidad puede dificultar verla.')
  }

  score = Math.round(Math.max(0, Math.min(100, score)))

  const label = score >= 75 ? 'Muy buenas' : score >= 50 ? 'Buenas' : score >= 25 ? 'Difíciles' : 'Poco favorables'

  return { score, label, reasons }
}

export function normalizeDegrees(value: number) {
  return ((value % 360) + 360) % 360
}

export function angularDifference(target: number, current: number) {
  return ((target - current + 540) % 360) - 180
}

function toCardinal(azimuth: number) {
  const labels = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO']
  return labels[Math.round(normalizeDegrees(azimuth) / 45) % 8]
}

function getDarknessLabel(sunAltitude: number): SkyPosition['darkness'] {
  if (sunAltitude > -6) return 'día'
  if (sunAltitude > -12) return 'crepúsculo'
  if (sunAltitude > -18) return 'noche'
  return 'noche profunda'
}
