export type CompassState = {
  heading: number | null
  supported: boolean
  precise: boolean
}

type IOSDeviceOrientationEvent = DeviceOrientationEvent & {
  webkitCompassHeading?: number
}

type OrientationConstructor = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>
}

export async function requestCompassPermission() {
  const Orientation = DeviceOrientationEvent as OrientationConstructor
  if (typeof Orientation.requestPermission === 'function') {
    const result = await Orientation.requestPermission()
    if (result !== 'granted') throw new Error('Permiso de orientación rechazado.')
  }
}

export function subscribeToCompass(onChange: (state: CompassState) => void) {
  if (!('DeviceOrientationEvent' in window)) {
    onChange({ heading: null, supported: false, precise: false })
    return () => undefined
  }

  const handler = (rawEvent: DeviceOrientationEvent) => {
    const event = rawEvent as IOSDeviceOrientationEvent
    if (typeof event.webkitCompassHeading === 'number') {
      onChange({ heading: event.webkitCompassHeading, supported: true, precise: true })
      return
    }

    if (typeof event.alpha === 'number') {
      onChange({ heading: (360 - event.alpha + 360) % 360, supported: true, precise: Boolean(event.absolute) })
      return
    }

    onChange({ heading: null, supported: true, precise: false })
  }

  window.addEventListener('deviceorientationabsolute', handler as EventListener, true)
  window.addEventListener('deviceorientation', handler, true)

  return () => {
    window.removeEventListener('deviceorientationabsolute', handler as EventListener, true)
    window.removeEventListener('deviceorientation', handler, true)
  }
}
