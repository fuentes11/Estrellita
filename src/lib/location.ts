export type UserLocation = {
  latitude: number
  longitude: number
  accuracy?: number
  label: string
}

export const PRESET_LOCATIONS: UserLocation[] = [
  {
    label: 'Altavista, El Salvador',
    latitude: 13.7111,
    longitude: -89.1043
  },
  {
    label: 'Calgary, Canadá',
    latitude: 51.0447,
    longitude: -114.0719
  }
]

export function requestLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Este dispositivo no ofrece geolocalización.'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          label: 'Tu ubicación actual'
        })
      },
      (error) => reject(new Error(error.message || 'No fue posible obtener tu ubicación.')),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    )
  })
}
