import type { WeatherType } from '@/data/types'

export const weatherBgMap: Record<WeatherType, string> = {
  sunny: 'linear-gradient(135deg, #f97316 0%, #fbbf24 30%, #fdba74 70%, #fef3c7 100%)',
  partly_cloudy: 'linear-gradient(135deg, #6366f1 0%, #818cf8 30%, #a5b4fc 60%, #c7d2fe 100%)',
  cloudy: 'linear-gradient(135deg, #475569 0%, #64748b 40%, #94a3b8 80%, #cbd5e1 100%)',
  overcast: 'linear-gradient(135deg, #334155 0%, #475569 50%, #64748b 100%)',
  light_rain: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 40%, #60a5fa 70%, #93c5fd 100%)',
  moderate_rain: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 40%, #3b82f6 80%)',
  heavy_rain: 'linear-gradient(135deg, #0c1445 0%, #1e3a8a 50%, #1d4ed8 100%)',
  thunderstorm: 'linear-gradient(135deg, #312e81 0%, #4c1d95 30%, #581c87 60%, #1e1b4b 100%)',
  snow: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 30%, #7dd3fc 60%, #38bdf8 100%)',
  fog: 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 40%, #e2e8f0 70%, #f1f5f9 100%)',
  haze: 'linear-gradient(135deg, #a16207 0%, #ca8a04 30%, #d4a017 60%, #eab308 100%)',
  windy: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 40%, #0284c7 70%, #0ea5e9 100%)',
}

export const weatherIconMap: Record<WeatherType, string> = {
  sunny: '☀',
  partly_cloudy: '⛅',
  cloudy: '☁',
  overcast: '🌥',
  light_rain: '🌦',
  moderate_rain: '🌧',
  heavy_rain: '🌧',
  thunderstorm: '⛈',
  snow: '🌨',
  fog: '🌫',
  haze: '😷',
  windy: '🌬',
}

export function getAqiColor(aqi: number): string {
  if (aqi <= 50) return '#22c55e'
  if (aqi <= 100) return '#eab308'
  if (aqi <= 150) return '#f97316'
  if (aqi <= 200) return '#ef4444'
  if (aqi <= 300) return '#a855f7'
  return '#7e0023'
}

export function getAqiLabel(aqi: number): string {
  if (aqi <= 50) return '优'
  if (aqi <= 100) return '良'
  if (aqi <= 150) return '轻度'
  if (aqi <= 200) return '中度'
  if (aqi <= 300) return '重度'
  return '严重'
}

export function getUvLevel(uv: number): string {
  if (uv <= 2) return '低'
  if (uv <= 5) return '中等'
  if (uv <= 7) return '高'
  if (uv <= 10) return '很高'
  return '极高'
}

export function getUvColor(uv: number): string {
  if (uv <= 2) return '#22c55e'
  if (uv <= 5) return '#eab308'
  if (uv <= 7) return '#f97316'
  if (uv <= 10) return '#ef4444'
  return '#a855f7'
}
