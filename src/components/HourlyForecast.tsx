import { motion } from 'framer-motion'
import type { HourlyItem } from '@/data/types'
import { weatherIconMap } from '@/utils/weatherUtils'

interface HourlyForecastProps {
  hourly: HourlyItem[]
}

export default function HourlyForecast({ hourly }: HourlyForecastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="glass p-4"
    >
      <h3 className="text-sm font-medium glass-text-muted mb-3">逐时预报</h3>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 pb-1" style={{ minWidth: hourly.length * 72 }}>
          {hourly.map((item, i) => (
            <div key={item.time} className="flex flex-col items-center gap-1.5 min-w-[64px]">
              <span className="text-[11px] glass-text-muted">{i === 0 ? '现在' : item.time}</span>
              <span className="text-xl">{weatherIconMap[item.weatherType]}</span>
              <span className="text-sm font-medium glass-text">{item.temperature}°</span>
              {item.precipitation > 0 && (
                <span className="text-[10px] text-blue-300/70">{item.precipitation}mm</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
