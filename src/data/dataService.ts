import type { WeatherData, GeoLocation } from './types'
import { mockWeatherData, mockGeoLocations } from './mockData'

const DATA_MODE = import.meta.env.VITE_DATA_MODE || 'mock'
const QWEATHER_KEY = import.meta.env.VITE_QWEATHER_KEY || ''

async function fetchFromAPI(path: string): Promise<unknown> {
  const url = `https://devapi.qweather.com${path}?key=${QWEATHER_KEY}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

function mapApiCurrent(raw: unknown): WeatherData['current'] {
  const r = raw as Record<string, unknown>
  return {
    location: `${r.province} ${r.city} ${r.district}`,
    province: String(r.province ?? ''),
    city: String(r.city ?? ''),
    district: String(r.district ?? ''),
    latitude: Number(r.lat ?? 0),
    longitude: Number(r.lon ?? 0),
    weatherType: mapWeatherCode(String(r.icon ?? '100')),
    weatherText: String(r.text ?? ''),
    temperature: Number(r.temp ?? 0),
    feelsLike: Number(r.feelsLike ?? 0),
    humidity: Number(r.humidity ?? 0),
    windSpeed: Number(r.windSpeed ?? 0),
    windDirection: String(r.windDir ?? ''),
    wind360: Number(r.wind360 ?? 0),
    pressure: Number(r.pressure ?? 0),
    visibility: Number(r.vis ?? 0),
    uvIndex: Number(r.uvIndex ?? 0),
    aqi: Number(r.aqi ?? 0),
    aqiLevel: String(r.aqiLevel ?? ''),
    aqiCategory: String(r.aqiCategory ?? ''),
    sunrise: String(r.sunrise ?? ''),
    sunset: String(r.sunset ?? ''),
    updateTime: String(r.updateTime ?? ''),
  }
}

function mapWeatherCode(icon: string): WeatherData['current']['weatherType'] {
  const code = parseInt(icon)
  if (code === 100) return 'sunny'
  if (code === 101 || code === 102 || code === 103) return 'partly_cloudy'
  if (code === 104 || code === 150 || code === 151) return 'cloudy'
  if (code >= 300 && code <= 304) return 'light_rain'
  if (code >= 305 && code <= 309) return 'moderate_rain'
  if (code >= 310 && code <= 312) return 'heavy_rain'
  if (code >= 313 && code <= 318) return 'thunderstorm'
  if (code >= 400 && code <= 406) return 'snow'
  if (code >= 500 && code <= 502) return 'fog'
  if (code >= 503 && code <= 509) return 'haze'
  if (code >= 800) return 'windy'
  return 'partly_cloudy'
}

export async function getWeatherData(locationId?: string): Promise<WeatherData> {
  if (DATA_MODE === 'mock') {
    return mockWeatherData
  }

  try {
    const id = locationId || '101020600'
    const [weatherNow, hourly, daily, indices] = await Promise.all([
      fetchFromAPI(`/v7/weather-now?location=${id}`),
      fetchFromAPI(`/v7/weather-24h?location=${id}`),
      fetchFromAPI(`/v7/weather-7d?location=${id}`),
      fetchFromAPI(`/v7/indices?location=${id}&type=0`),
    ])

    const wNow = (weatherNow as Record<string, unknown>)?.now as Record<string, unknown>
    const hList = ((hourly as Record<string, unknown>)?.hourly ?? []) as Record<string, unknown>[]
    const dList = ((daily as Record<string, unknown>)?.daily ?? []) as Record<string, unknown>[]
    const iList = ((indices as Record<string, unknown>)?.daily ?? []) as Record<string, unknown>[]

    return {
      current: mapApiCurrent({ ...wNow, location: id }),
      hourly: hList.map(h => ({
        time: String(h.fxTime ?? '').slice(11, 16),
        weatherType: mapWeatherCode(String(h.icon ?? '100')),
        weatherText: String(h.text ?? ''),
        temperature: Number(h.temp ?? 0),
        precipitation: Number(h.precip ?? 0),
        windSpeed: Number(h.windSpeed ?? 0),
        windDirection: String(h.windDir ?? ''),
        humidity: Number(h.humidity ?? 0),
      })),
      daily: dList.map(d => ({
        date: String(d.fxDate ?? '').slice(5),
        weekday: '',
        weatherTypeDay: mapWeatherCode(String(d.iconDay ?? '100')),
        weatherTypeNight: mapWeatherCode(String(d.iconNight ?? '100')),
        weatherTextDay: String(d.textDay ?? ''),
        weatherTextNight: String(d.textNight ?? ''),
        tempMax: Number(d.tempMax ?? 0),
        tempMin: Number(d.tempMin ?? 0),
        precipitation: Number(d.precip ?? 0),
        uvIndex: Number(d.uvIndex ?? 0),
        sunrise: String(d.sunrise ?? ''),
        sunset: String(d.sunset ?? ''),
      })),
      lifeAdvice: iList.map(i => ({
        category: String(i.name ?? ''),
        level: String(i.level ?? ''),
        text: String(i.text ?? ''),
        icon: String(i.type ?? ''),
      })),
    }
  } catch {
    return mockWeatherData
  }
}

export async function searchLocation(keyword: string): Promise<GeoLocation[]> {
  if (DATA_MODE === 'mock') {
    const lower = keyword.toLowerCase()
    return mockGeoLocations.filter(
      g => g.name.toLowerCase().includes(lower) || g.city.toLowerCase().includes(lower) || g.district.toLowerCase().includes(lower),
    )
  }

  try {
    const res = await fetchFromAPI(`/v2/city/lookup?location=${encodeURIComponent(keyword)}`)
    const list = ((res as Record<string, unknown>)?.location ?? []) as Record<string, unknown>[]
    return list.map(l => ({
      id: String(l.id ?? ''),
      name: String(l.name ?? ''),
      province: String(l.adm1 ?? ''),
      city: String(l.adm2 ?? ''),
      district: String(l.name ?? ''),
      latitude: Number(l.lat ?? 0),
      longitude: Number(l.lon ?? 0),
    }))
  } catch {
    return mockGeoLocations.filter(
      g => g.name.toLowerCase().includes(keyword.toLowerCase()),
    )
  }
}
