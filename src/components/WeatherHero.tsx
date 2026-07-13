import type { CurrentWeather } from '@/data/types'
import { weatherIconMap } from '@/utils/weatherUtils'

interface WeatherHeroProps {
  current: CurrentWeather
}

export default function WeatherHero({ current }: WeatherHeroProps) {
  const icon = weatherIconMap[current.weatherType] || '⛅'

  return (
    <section className="glass-hero p-6 md:p-8 lg:p-10 fade-in space-y-4">
      {/* 位置与更新时间 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-glass-secondary text-sm md:text-base font-medium">
            {current.location}
          </h1>
          <p className="text-glass-dim text-xs mt-1">
            {current.updateTime.slice(11, 16)} 更新
          </p>
        </div>
        <div className="glass-sm px-3 py-1.5 text-xs text-glass-muted">
          中国气象局
        </div>
      </div>

      {/* 主天气信息 - 大面积展示 */}
      <div className="flex items-start gap-6 md:gap-10 pt-2">
        <div className="flex-shrink-0">
          <span className="text-5xl md:text-6xl lg:text-7xl">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-glass-primary text-2xl md:text-3xl font-semibold">
            {current.weatherText}
          </p>
          <p className="text-glass-primary text-6xl md:text-7xl lg:text-8xl font-light tracking-tight mt-1">
            {current.temperature}°
          </p>
        </div>
      </div>

      {/* 体感 + 湿度 + 风速 概览 */}
      <div className="flex gap-6 md:gap-10 text-sm md:text-base">
        <div className="flex items-center gap-2">
          <span className="text-glass-muted">体感</span>
          <span className="text-glass-primary font-medium">{current.feelsLike}°</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-glass-muted">湿度</span>
          <span className="text-glass-primary font-medium">{current.humidity}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-glass-muted">{current.windDirection}</span>
          <span className="text-glass-primary font-medium">{current.windSpeed}km/h</span>
        </div>
      </div>

      {/* AQI 突出显示 */}
      <AQIBadge aqi={current.aqi} category={current.aqiCategory} />
    </section>
  )
}

function AQIBadge({ aqi, category }: { aqi: number; category: string }) {
  const color = aqiColor(aqi)

  return (
    <div className="glass-light px-4 py-3 fade-in-delay-2 flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span
          className="inline-block w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-glass-secondary text-sm font-medium">空气质量</span>
      </div>
      <span className="text-glass-primary text-xl md:text-2xl font-semibold">{aqi}</span>
      <span className="text-glass-secondary text-sm">{category}</span>
      <div className="flex-1 flex items-center gap-1 ml-4">
        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${Math.min((aqi / 300) * 100, 100)}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>
    </div>
  )
}

function aqiColor(aqi: number): string {
  if (aqi <= 50) return '#00e400'
  if (aqi <= 100) return '#ffff00'
  if (aqi <= 150) return '#ff7e00'
  if (aqi <= 200) return '#ff0000'
  if (aqi <= 300) return '#99004c'
  return '#7e0023'
}
