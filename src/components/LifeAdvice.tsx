import type { LifeAdvice } from '@/data/types'

const iconMap: Record<string, string> = {
  shirt: '👕', running: '🏃', umbrella: '☂', car: '🚗', sun: '☀', thermometer: '🌡',
}

interface LifeAdviceProps {
  advice: LifeAdvice[]
}

export default function LifeAdvice({ advice }: LifeAdviceProps) {
  return (
    <div className="glass p-4 md:p-5 fade-in-delay-5">
      <h3 className="text-sm font-medium text-glass-muted mb-3">生活建议</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
        {advice.map((item) => (
          <div key={item.category} className="glass-sm glass-hover p-3 md:p-4 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-base md:text-lg">{iconMap[item.icon] || '📋'}</span>
              <span className="text-xs font-medium text-glass-secondary">{item.category}</span>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-white/10 text-glass-muted">{item.level}</span>
            </div>
            <p className="text-xs text-glass-muted leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
