import { motion } from 'framer-motion'
import type { CurrentWeather } from '@/data/types'
import { getUvLevel, getUvColor } from '@/utils/weatherUtils'

interface WeatherDetailsProps {
  current: CurrentWeather
}

function DetailCard({ icon, label, value, unit, color }: {
  icon: React.ReactNode
  label: string
  value: string | number
  unit?: string
  color?: string
}) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} className="glass-sm glass-hover p-3 flex flex-col gap-1">
      <div className="flex items-center gap-1 glass-text-muted text-[11px]">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-base font-semibold glass-text" style={color ? { color } : undefined}>
        {value}
        {unit && <span className="text-xs glass-text-muted ml-0.5">{unit}</span>}
      </div>
    </motion.div>
  )
}

export default function WeatherDetails({ current }: WeatherDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
    >
      <h3 className="text-sm font-medium glass-text-muted mb-3">详细指标</h3>

      <div className="grid grid-cols-3 gap-2">
        <DetailCard
          icon={<span className="text-yellow-400 text-sm">☀</span>}
          label="紫外线"
          value={`${current.uvIndex} ${getUvLevel(current.uvIndex)}`}
          color={getUvColor(current.uvIndex)}
        />
        <DetailCard
          icon={<span className="text-blue-300 text-sm">💧</span>}
          label="湿度"
          value={current.humidity}
          unit="%"
        />
        <DetailCard
          icon={<span className="text-teal-300 text-sm">💨</span>}
          label="风速"
          value={current.windSpeed}
          unit="km/h"
        />
        <DetailCard
          icon={<span className="text-violet-300 text-sm">🔘</span>}
          label="气压"
          value={current.pressure}
          unit="hPa"
        />
        <DetailCard
          icon={<span className="text-cyan-300 text-sm">👁</span>}
          label="能见度"
          value={current.visibility}
          unit="km"
        />
        <DetailCard
          icon={<span className="text-orange-300 text-sm">🌅</span>}
          label="日出 / 日落"
          value={current.sunrise}
          unit={` / ${current.sunset}`}
        />
      </div>
    </motion.div>
  )
}
