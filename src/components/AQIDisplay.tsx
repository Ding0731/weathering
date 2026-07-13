import { motion } from 'framer-motion'
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.12 }}
      className="glass p-4"
    >
      <h3 className="text-sm font-medium glass-text-muted mb-3">空气质量</h3>

      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 glass-sm flex items-center justify-center font-bold text-lg"
          style={{ color }}
        >
          {current.aqi}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium" style={{ color }}>{label}</span>
            <span className="text-xs glass-text-muted">{current.aqiCategory}</span>
          </div>

          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: color }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>

          <div className="flex justify-between mt-1 text-[9px] glass-text-muted opacity-50">
            <span>0</span>
            <span>50</span>
            <span>100</span>
            <span>150</span>
            <span>300+</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
