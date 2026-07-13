import type { WeatherData, GeoLocation } from './types'
import { mockWeatherData, mockGeoLocations } from './mockData'

const DATA_MODE = import.meta.env.VITE_DATA_MODE || 'mock'
const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || ''

// 高德天气API (数据来源: 中国气象局)
const AMAP_BASE = 'https://restapi.amap.com/v3'

async function fetchAmap(path: string): Promise<unknown> {
  const url = `${AMAP_BASE}${path}&key=${AMAP_KEY}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

function mapAmapWeather(text: string): WeatherData['current']['weatherType'] {
  const t = text.toLowerCase()
  if (t.includes('晴')) return 'sunny'
  if (t.includes('少云') || t.includes('晴间多云')) return 'partly_cloudy'
  if (t.includes('多云') || t.includes('阴')) return 'cloudy'
  if (t.includes('小雨') || t.includes('阵雨')) return 'light_rain'
  if (t.includes('中雨')) return 'moderate_rain'
  if (t.includes('大雨') || t.includes('暴雨')) return 'heavy_rain'
  if (t.includes('雷')) return 'thunderstorm'
  if (t.includes('雪') || t.includes('冰雹')) return 'snow'
  if (t.includes('雾')) return 'fog'
  if (t.includes('霾') || t.includes('沙尘')) return 'haze'
  if (t.includes('风') || t.includes('台风')) return 'windy'
  return 'partly_cloudy'
}

export async function getWeatherData(locationId?: string): Promise<WeatherData> {
  if (DATA_MODE === 'mock') {
    return mockWeatherData
  }

  try {
    const adcode = locationId || '310115' // 默认浦东新区adcode

    // 高德实时天气 + 预报天气
    const [liveRes, forecastRes] = await Promise.all([
      fetchAmap(`/weather/weatherInfo?city=${adcode}&extensions=base`),
      fetchAmap(`/weather/weatherInfo?city=${adcode}&extensions=all`),
    ])

    const livesArr = ((liveRes as Record<string, unknown>)?.lives ?? []) as Record<string, unknown>[]
    const forecastsArr = ((forecastRes as Record<string, unknown>)?.forecasts ?? []) as Record<string, unknown>[]
    const live = livesArr[0] ?? {}
    const forecasts = forecastsArr[0] ?? {}
    const castList = (forecasts?.casts ?? []) as Record<string, unknown>[]

    if (!live) return mockWeatherData

    const province = String(live.province ?? '')
    const city = String(live.city ?? '')
    const district = String(live.district ?? '')
    const weatherText = String(live.weather ?? '')
    const temp = Number(live.temperature ?? 0)
    const windDir = String(live.winddirection ?? '')
    const windPower = String(live.windpower ?? '')
    const humidity = Number(live.humidity ?? 0)
    const reportTime = String(live.reporttime ?? '')

    // AQI from 高德 (需要额外调用，但base模式不含AQI，用mock值)
    const mockCurrent = mockWeatherData.current

    return {
      current: {
        location: `${province} ${city} ${district}`,
        province,
        city,
        district,
        latitude: mockCurrent.latitude,
        longitude: mockCurrent.longitude,
        weatherType: mapAmapWeather(weatherText),
        weatherText,
        temperature: temp,
        feelsLike: temp + Math.round((humidity - 60) * 0.1), // 估算体感温度
        humidity,
        windSpeed: parseInt(windPower) || 0,
        windDirection: windDir,
        wind360: 0,
        pressure: mockCurrent.pressure,
        visibility: mockCurrent.visibility,
        uvIndex: mockCurrent.uvIndex,
        aqi: mockCurrent.aqi,
        aqiLevel: mockCurrent.aqiLevel,
        aqiCategory: mockCurrent.aqiCategory,
        sunrise: String(castList[0]?.sunrise ?? mockCurrent.sunrise),
        sunset: String(castList[0]?.sunset ?? mockCurrent.sunset),
        updateTime: reportTime,
      },
      hourly: mockWeatherData.hourly, // 高德免费API不含逐时数据，用mock
      daily: castList.map((cast, i) => {
        const dayWeather = String(cast.dayweather ?? '')
        const nightWeather = String(cast.nightweather ?? '')
        const dayTemp = Number(cast.daytemp ?? 0)
        const nightTemp = Number(cast.nighttemp ?? 0)
        const weekdays = ['今天', '周一', '周二', '周三', '周四', '周五', '周六', '周日']
        const dateStr = String(cast.date ?? '')

        return {
          date: dateStr.slice(4, 6) + '-' + dateStr.slice(6, 8) || `07-${13 + i}`,
          weekday: weekdays[i] || `第${i}天`,
          weatherTypeDay: mapAmapWeather(dayWeather),
          weatherTypeNight: mapAmapWeather(nightWeather),
          weatherTextDay: dayWeather,
          weatherTextNight: nightWeather,
          tempMax: dayTemp,
          tempMin: nightTemp,
          precipitation: 0,
          uvIndex: 5,
          sunrise: String(cast.sunrise ?? ''),
          sunset: String(cast.sunset ?? ''),
        }
      }).slice(0, 7),
      lifeAdvice: mockWeatherData.lifeAdvice, // 高德不含生活指数，用mock
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
    const res = await fetchAmap(`/config/district?keywords=${encodeURIComponent(keyword)}&subdistrict=3`)
    const districts = ((res as Record<string, unknown>)?.districts ?? []) as Record<string, unknown>[]

    const results: GeoLocation[] = []
    for (const d of districts) {
      const adcode = String(d.adcode ?? '')
      const name = String(d.name ?? '')
      const level = String(d.level ?? '')
      const center = String(d.center ?? '')
      const [lng, lat] = center.split(',').map(Number)

      // 只取区县级
      if (level === 'district' || level === 'street') {
        results.push({
          id: adcode,
          name,
          province: String(d.adm1 ?? d.adm1_prov ?? ''),
          city: String(d.adm2 ?? d.adm2_city ?? ''),
          district: name,
          latitude: lat || 0,
          longitude: lng || 0,
        })
      }

      // 也处理区县子节点
      const children = (d.districtList ?? []) as Record<string, unknown>[]
      for (const child of children) {
        const childAdcode = String(child.adcode ?? '')
        const childName = String(child.name ?? '')
        const childCenter = String(child.center ?? '')
        const [childLng, childLat] = childCenter.split(',').map(Number)
        const childLevel = String(child.level ?? '')

        if (childLevel === 'district' || childLevel === 'street') {
          results.push({
            id: childAdcode,
            name: childName,
            province: name,
            city: name,
            district: childName,
            latitude: childLat || 0,
            longitude: childLng || 0,
          })
        }
      }
    }

    return results.length > 0 ? results : mockGeoLocations.filter(
      g => g.name.toLowerCase().includes(keyword.toLowerCase()),
    )
  } catch {
    return mockGeoLocations.filter(
      g => g.name.toLowerCase().includes(keyword.toLowerCase()),
    )
  }
}
