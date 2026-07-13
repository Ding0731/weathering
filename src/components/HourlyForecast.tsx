import type { HourlyItem } from '@/data/types'
import { weatherIconMap } from '@/utils/weatherUtils'

interface HourlyForecastProps {
  hourly: HourlyItem[]
}

export default function HourlyForecast({ hourly }: HourlyForecastProps) {
  return (
    <div className="glass p-4 md:p-5 fade-in-delay-2">
      <h3 className="text-sm font-medium text-glass-muted mb-3">逐时预报</h3>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 md:gap-4 pb-1" style={{ minWidth: hourly.length * 76 }}>
          {hourly.map((item, i) => (
            <div key={item.time} className="flex flex-col items-center gap-1.5 min-w-[68px]">
              <span className="text-xs text-glass-muted">{i === 0 ? '现在' : item.time}</span>
              <span className="text-xl md:text-2xl">{weatherIconMap[item.weatherType]}</span>
              <span className="text-sm md:text-base font-medium text-glass-primary">{item.temperature}°</span>
              {item.precipitation > 0 && (
                <span className="text-[11px] text-blue-300/80">{item.precipitation}mm</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
