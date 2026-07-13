export type WeatherType =
  | 'sunny'
  | 'partly_cloudy'
  | 'cloudy'
  | 'overcast'
  | 'light_rain'
  | 'moderate_rain'
  | 'heavy_rain'
  | 'thunderstorm'
  | 'snow'
  | 'fog'
  | 'haze'
  | 'windy'

export interface CurrentWeather {
  location: string
  province: string
  city: string
  district: string
  latitude: number
  longitude: number
  weatherType: WeatherType
  weatherText: string
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  windDirection: string
  wind360: number
  pressure: number
  visibility: number
  uvIndex: number
  aqi: number
  aqiLevel: string
  aqiCategory: string
  sunrise: string
  sunset: string
  updateTime: string
}

export interface HourlyItem {
  time: string
  weatherType: WeatherType
  weatherText: string
  temperature: number
  precipitation: number
  windSpeed: number
  windDirection: string
  humidity: number
}

export interface DailyItem {
  date: string
  weekday: string
  weatherTypeDay: WeatherType
  weatherTypeNight: WeatherType
  weatherTextDay: string
  weatherTextNight: string
  tempMax: number
  tempMin: number
  precipitation: number
  uvIndex: number
  sunrise: string
  sunset: string
}

export interface LifeAdvice {
  category: string
  level: string
  text: string
  icon: string
}

export interface WeatherData {
  current: CurrentWeather
  hourly: HourlyItem[]
  daily: DailyItem[]
  lifeAdvice: LifeAdvice[]
}

export interface GeoLocation {
  id: string
  name: string
  province: string
  city: string
  district: string
  latitude: number
  longitude: number
}
