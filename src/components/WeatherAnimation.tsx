import { useRef, useEffect, useCallback, useState } from 'react'
import type { WeatherType } from '@/data/types'
import { createParticleSystem, drawBackground } from '@/utils/weatherCanvas'

interface WeatherAnimationProps {
  weatherType: WeatherType
}

export default function WeatherAnimation({ weatherType }: WeatherAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const speedRef = useRef(1)
  const [speedLabel, setSpeedLabel] = useState(1)
  const systemRef = useRef<ReturnType<typeof createParticleSystem> | null>(null)
  const rafRef = useRef<number>(0)
  const frameRef = useRef(0)
  const weatherRef = useRef(weatherType)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      if (systemRef.current) {
        systemRef.current.resize(canvas.width, canvas.height)
      }
    }
    resize()
    window.addEventListener('resize', resize)

    systemRef.current = createParticleSystem(weatherRef.current, canvas.width, canvas.height)

    const loop = () => {
      frameRef.current++
      const s = speedRef.current
      drawBackground(ctx!, weatherRef.current, canvas.width, canvas.height, frameRef.current)
      systemRef.current?.update(s)
      systemRef.current?.draw(ctx!)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  useEffect(() => {
    weatherRef.current = weatherType
    if (systemRef.current) {
      systemRef.current = createParticleSystem(weatherType, canvasRef.current?.width ?? window.innerWidth, canvasRef.current?.height ?? window.innerHeight)
    }
  }, [weatherType])

  const handlePointerDown = useCallback(() => {
    speedRef.current = 3
    setSpeedLabel(3)
  }, [])
  const handlePointerUp = useCallback(() => {
    speedRef.current = 1
    setSpeedLabel(1)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 cursor-pointer"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onContextMenu={e => e.preventDefault()}
    />
  )
}
