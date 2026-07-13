import { useRef, useEffect, useState, useCallback } from 'react'
import type { WeatherType } from '@/data/types'

const videoMap: Record<string, string> = {
  sunny: '/weathering/videos/sunny.mp4',
  partly_cloudy: '/weathering/videos/partly_cloudy.mp4',
  cloudy: '/weathering/videos/cloudy.mp4',
  overcast: '/weathering/videos/cloudy.mp4',
  light_rain: '/weathering/videos/rain.mp4',
  moderate_rain: '/weathering/videos/rain.mp4',
  heavy_rain: '/weathering/videos/thunderstorm.mp4',
  thunderstorm: '/weathering/videos/thunderstorm.mp4',
  snow: '/weathering/videos/snow.mp4',
  fog: '/weathering/videos/fog.mp4',
  haze: '/weathering/videos/fog.mp4',
  windy: '/weathering/videos/windy.mp4',
}

interface WeatherAnimationProps {
  weatherType: WeatherType
}

export default function WeatherAnimation({ weatherType }: WeatherAnimationProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const prevSrcRef = useRef<string>(videoMap[weatherType])
  const [opacity, setOpacity] = useState(1)
  const [currentSrc, setCurrentSrc] = useState(videoMap[weatherType])

  const handleVideoEnd = useCallback(() => {
    const v = videoRef.current
    if (v) v.currentTime = 0
  }, [])

  useEffect(() => {
    const newSrc = videoMap[weatherType]
    if (newSrc === prevSrcRef.current) return

    // Fade out, swap src, fade in
    setOpacity(0)
    const timer = setTimeout(() => {
      setCurrentSrc(newSrc)
      prevSrcRef.current = newSrc
      setOpacity(1)
    }, 800)

    return () => clearTimeout(timer)
  }, [weatherType])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.play().catch(() => {})
  }, [currentSrc])

  return (
    <>
      <video
        ref={videoRef}
        key={currentSrc}
        src={currentSrc}
        autoPlay
        loop
        muted
        playsInline
        onEnded={handleVideoEnd}
        className="fixed inset-0 w-full h-full object-cover video-transition"
        style={{ opacity, zIndex: 0 }}
      />
      <div className="video-overlay" />
    </>
  )
}
