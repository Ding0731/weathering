import type { CurrentWeather } from '@/data/types'
import { getAqiColor, getAqiLabel } from '@/utils/weatherUtils'

interface AQIDisplayProps {
  current: CurrentWeather
}

export default function AQIDisplay({ current }: AQIDisplayProps) {
  const color = getAqiColor(current.aqi)
  const label = getAqiLabel(current.aqi)
  const pct = Math.min(current.aqi / 300 * 100, 100)

  return (
    <div className="glass-light px-4 py-3 fade-in-delay-1 flex items-center gap-4">
      <div className="w-12 h-12 glass-sm flex items-center justify-center font-bold text-lg text-glass-primary" style={{ color }}>
        {current.aqi}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-glass-primary" style={{ color }}>{label}</span>
          <span className="text-xs text-glass-muted">{current.aqiCategory}</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ backgroundColor: color, width: `${pct}%` }} />
        </div>
      </div>
    </div>
  )
}
