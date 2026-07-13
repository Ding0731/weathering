import type { CurrentWeather } from '@/data/types'
import { weatherIconMap } from '@/utils/weatherUtils'

interface WeatherHeroProps {
  current: CurrentWeather
}

export default function WeatherHero({ current }: WeatherHeroProps) {
  const icon = weatherIconMap[current.weatherType] || '☁'

  return (
    <div className="glass p-6 fade-in">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-6xl">{icon}</div>
          <div className="text-lg glass-text-secondary mt-2">{current.weatherText}</div>
          <div className="text-xs glass-text-muted mt-0.5">
            体感 {current.feelsLike}° · 湿度 {current.humidity}%
          </div>
        </div>
        <div className="text-right">
          <div className="text-8xl font-extralight glass-text tracking-tighter leading-none">
            {current.temperature}
            <span className="text-4xl font-light opacity-40">°</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="glass-sm px-2.5 py-1 text-xs flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getAqiDotColor(current.aqi) }} />
          <span className="glass-text-secondary">空气质量</span>
          <span className="font-medium" style={{ color: getAqiDotColor(current.aqi) }}>
            {getAqiShortLabel(current.aqi)} {current.aqi}
          </span>
        </div>
        <span className="text-[11px] glass-text-muted">
          {current.updateTime.slice(11, 16)} 更新
        </span>
      </div>
    </div>
  )
}

function getAqiDotColor(aqi: number): string {
  if (aqi <= 50) return '#22c55e'
  if (aqi <= 100) return '#eab308'
  if (aqi <= 150) return '#f97316'
  if (aqi <= 200) return '#ef4444'
  if (aqi <= 300) return '#a855f7'
  return '#7e0023'
}

function getAqiShortLabel(aqi: number): string {
  if (aqi <= 50) return '优'
  if (aqi <= 100) return '良'
  if (aqi <= 150) return '轻度'
  if (aqi <= 200) return '中度'
  if (aqi <= 300) return '重度'
  return '严重'
}
