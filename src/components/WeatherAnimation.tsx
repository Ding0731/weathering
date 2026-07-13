import { useState, useCallback, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { WeatherType } from '@/data/types'

interface WeatherAnimationProps {
  weatherType: WeatherType
}

function SunnyParticles() {
  return (
    <>
      <motion.div
        className="absolute top-[8%] right-[12%] w-28 h-28 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.4) 0%, rgba(251,191,36,0) 70%)' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={`ray-${i}`}
          className="absolute top-[8%] right-[12%] w-0.5 origin-bottom-right"
          style={{ height: 60 + i * 4, rotate: i * 30 }}
          animate={{ scaleY: [0.6, 1, 0.6], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
        />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={`spark-${i}`}
          className="absolute w-1 h-1 rounded-full bg-yellow-300/30"
          style={{ left: `${20 + i * 15}%`, top: `${15 + (i % 3) * 25}%` }}
          animate={{ opacity: [0, 0.5, 0], scale: [0.5, 1.5, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
    </>
  )
}

function RainParticles({ heavy }: { heavy?: boolean }) {
  const count = heavy ? 50 : 30
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={`drop-${i}`}
          className="absolute w-[1px] rounded-full bg-blue-200/40"
          style={{
            height: heavy ? 20 : 14,
            left: `${(i / count) * 100}%`,
            top: '-2%',
          }}
          animate={{
            y: [0, window.innerHeight + 20],
            opacity: [0, 0.6, 0.3, 0],
          }}
          transition={{
            duration: heavy ? 0.6 : 1.0,
            repeat: Infinity,
            delay: i * 0.02,
            ease: 'linear',
          }}
        />
      ))}
      {heavy && Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`splash-${i}`}
          className="absolute rounded-full bg-blue-300/20"
          style={{ width: 40, height: 8, left: `${30 + i * 20}%`, bottom: '5%' }}
          animate={{ scaleX: [1, 2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}
    </>
  )
}

function ThunderParticles() {
  return (
    <>
      <RainParticles heavy />
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`flash-${i}`}
          className="absolute inset-0"
          animate={{ opacity: [0, 0, 0.15, 0, 0, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: i * 2, times: [0, 0.45, 0.47, 0.49, 0.51, 1] }}
        />
      ))}
    </>
  )
}

function SnowParticles() {
  return (
    <>
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={`flake-${i}`}
          className="absolute rounded-full bg-white/40"
          style={{
            width: 2 + (i % 3) * 2,
            height: 2 + (i % 3) * 2,
            left: `${(i / 40) * 100}%`,
            top: '-3%',
          }}
          animate={{
            y: [0, window.innerHeight + 10],
            x: [0, (i % 2 === 0 ? 30 : -30), 0],
            rotate: [0, 360],
            opacity: [0.4, 0.6, 0.2],
          }}
          transition={{
            duration: 6 + (i % 4),
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeOut',
          }}
        />
      ))}
    </>
  )
}

function CloudParticles() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`cloud-${i}`}
          className="absolute rounded-full bg-white/10"
          style={{
            width: 120 + i * 40,
            height: 40 + i * 15,
            top: `${8 + i * 14}%`,
            left: `${-20 + i * 18}%`,
            filter: 'blur(8px)',
          }}
          animate={{ x: [-30, 30, -30], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 8, repeat: Infinity, delay: i * 1, ease: 'easeInOut' }}
        />
      ))}
    </>
  )
}

function FogParticles() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`fog-${i}`}
          className="absolute bg-white/8 rounded-full"
          style={{
            width: 200 + i * 60,
            height: 80 + i * 20,
            top: `${i * 18}%`,
            left: '-10%',
            filter: 'blur(20px)',
          }}
          animate={{ x: [-40, 40, -40], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 10, repeat: Infinity, delay: i * 1.5, ease: 'easeInOut' }}
        />
      ))}
    </>
  )
}

function WindParticles() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`wind-${i}`}
          className="absolute h-[1px] bg-white/15"
          style={{ width: 30 + i * 10, top: `${12 + i * 10}%`, left: '-5%' }}
          animate={{ x: [-5, 105, -5], opacity: [0, 0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2, ease: 'easeIn' }}
        />
      ))}
    </>
  )
}

export default function WeatherAnimation({ weatherType }: WeatherAnimationProps) {
  const [speed, setSpeed] = useState(1)
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const accelerate = useCallback(() => { setSpeed(3) }, [])
  const decelerate = useCallback(() => { setSpeed(1) }, [])

  const handlePointerDown = useCallback(() => {
    pressTimer.current = setTimeout(accelerate, 150)
    accelerate()
  }, [accelerate])

  const handlePointerUp = useCallback(() => {
    if (pressTimer.current) clearTimeout(pressTimer.current)
    decelerate()
  }, [decelerate])

  useEffect(() => {
    return () => { if (pressTimer.current) clearTimeout(pressTimer.current) }
  }, [])

  const renderEffect = () => {
    const s = speed
    switch (weatherType) {
      case 'sunny': return <SunnyParticles />
      case 'partly_cloudy': return <><SunnyParticles /><CloudParticles /></>
      case 'cloudy': return <CloudParticles />
      case 'overcast': return <CloudParticles />
      case 'light_rain': return <RainParticles />
      case 'moderate_rain': return <RainParticles heavy />
      case 'heavy_rain': return <RainParticles heavy />
      case 'thunderstorm': return <ThunderParticles />
      case 'snow': return <SnowParticles />
      case 'fog': return <FogParticles />
      case 'haze': return <FogParticles />
      case 'windy': return <WindParticles />
      default: return <CloudParticles />
    }
  }

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-auto select-none cursor-pointer"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onContextMenu={e => e.preventDefault()}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: speed > 1 ? 1 : 0.8 }}
        transition={{ duration: 0.3 }}
        style={{ animationDuration: `${1 / s}s` }}
      >
        {renderEffect()}
      </motion.div>
      <div className="absolute bottom-4 right-4 glass-sm px-2 py-1 text-[11px] glass-text-muted">
        {speed > 1 ? '加速中' : '悬停 / 长按加速动效'}
      </div>
    </div>
  )
}
