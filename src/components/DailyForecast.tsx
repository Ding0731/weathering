import type { DailyItem } from '@/data/types'
import { weatherIconMap } from '@/utils/weatherUtils'

interface DailyForecastProps {
  daily: DailyItem[]
}

export default function DailyForecast({ daily }: DailyForecastProps) {
  const allTemps = daily.flatMap(d => [d.tempMin, d.tempMax])
  const minTemp = Math.min(...allTemps)
  const maxTemp = Math.max(...allTemps)
  const range = maxTemp - minTemp || 1

  return (
    <div className="glass p-4 md:p-5 fade-in-delay-3">
      <h3 className="text-sm font-medium text-glass-muted mb-3">7天预报</h3>
      <div className="space-y-3">
        {daily.map((day, i) => {
          const lowPct = ((day.tempMin - minTemp) / range) * 100
          const highPct = ((day.tempMax - minTemp) / range) * 100

          return (
            <div key={day.date} className="flex items-center gap-3 text-sm md:text-base">
              <span className="text-glass-muted w-10 shrink-0">{i === 0 ? '今天' : day.weekday}</span>
              <span className="text-xl shrink-0">{weatherIconMap[day.weatherTypeDay]}</span>
              <span className="text-glass-secondary w-16 shrink-0 truncate">{day.weatherTextDay}</span>
              <span className="text-glass-muted w-8 text-right shrink-0">{day.tempMin}°</span>
              <div className="flex-1 h-2 bg-white/8 rounded-full relative mx-2">
                <div
                  className="absolute h-full rounded-full"
                  style={{
                    left: `${lowPct}%`,
                    right: `${100 - highPct}%`,
                    background: 'linear-gradient(90deg, #60a5fa, #f87171)',
                  }}
                />
              </div>
              <span className="text-glass-primary w-8 shrink-0">{day.tempMax}°</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
