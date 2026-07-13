import { motion } from 'framer-motion'
import type { LifeAdvice } from '@/data/types'

const iconMap: Record<string, string> = {
  shirt: '👕', running: '🏃', umbrella: '☂', car: '🚗', sun: '☀', thermometer: '🌡',
}

interface LifeAdviceProps {
  advice: LifeAdvice[]
}

export default function LifeAdvice({ advice }: LifeAdviceProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass p-4"
    >
      <h3 className="text-sm font-medium glass-text-muted mb-3">生活建议</h3>

      <div className="grid grid-cols-2 gap-2">
        {advice.map((item) => (
          <motion.div
            key={item.category}
            whileHover={{ scale: 1.02 }}
            className="glass-sm glass-hover flex items-start gap-2 p-2.5"
          >
            <span className="text-base shrink-0">{iconMap[item.icon] || '📋'}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium glass-text-secondary">{item.category}</span>
                <span className="text-[10px] px-1 py-0.5 rounded bg-white/10 glass-text-muted">{item.level}</span>
              </div>
              <p className="text-[11px] glass-text-muted mt-0.5 leading-relaxed truncate">{item.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
