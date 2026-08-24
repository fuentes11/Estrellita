export type WeatherSnapshot = {
  cloudCover: number | null
}

export async function getWeather(latitude: number, longitude: number): Promise<WeatherSnapshot> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'cloud_cover',
    timezone: 'auto'
  })

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`)
  if (!response.ok) throw new Error('No se pudo consultar el clima.')

  const data = await response.json() as { current?: { cloud_cover?: number } }
  return { cloudCover: data.current?.cloud_cover ?? null }
}
