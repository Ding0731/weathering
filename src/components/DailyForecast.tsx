import { motion } from 'framer-motion'
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass p-4"
    >
      <h3 className="text-sm font-medium glass-text-muted mb-3">7天预报</h3>

      <div className="space-y-2">
        {daily.map((day, i) => {
          const lowPct = ((day.tempMin - minTemp) / range) * 100
          const highPct = ((day.tempMax - minTemp) / range) * 100

          return (
            <div key={day.date} className="flex items-center gap-3 text-sm">
              <span className="glass-text-muted w-8 shrink-0">{i === 0 ? '今天' : day.weekday}</span>
              <span className="text-lg shrink-0">{weatherIconMap[day.weatherTypeDay]}</span>
              <span className="glass-text-secondary w-14 shrink-0 truncate text-xs">{day.weatherTextDay}</span>

              <span className="glass-text-muted w-7 text-right shrink-0 text-xs">{day.tempMin}°</span>

              <div className="flex-1 h-1 bg-white/8 rounded-full relative mx-1">
                <motion.div
                  className="absolute h-full rounded-full"
                  style={{
                    left: `${lowPct}%`,
                    right: `${100 - highPct}%`,
                    background: 'linear-gradient(90deg, #60a5fa, #f87171)',
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                />
              </div>

              <span className="glass-text w-7 shrink-0 text-xs">{day.tempMax}°</span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
