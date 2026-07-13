import { useState, useCallback } from 'react'
import type { GeoLocation } from '@/data/types'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useWeather } from '@/hooks/useWeather'
import SearchBar from '@/components/SearchBar'
import WeatherHero from '@/components/WeatherHero'
import WeatherAnimation from '@/components/WeatherAnimation'
import HourlyForecast from '@/components/HourlyForecast'
import DailyForecast from '@/components/DailyForecast'
import WeatherDetails from '@/components/WeatherDetails'
import LifeAdvice from '@/components/LifeAdvice'

export default function App() {
  const { locationId, requestLocation } = useGeolocation()
  const [currentLocId, setCurrentLocId] = useState<string | undefined>(undefined)
  const { data, loading, error, refetch } = useWeather(currentLocId || locationId)

  const handleLocationSelect = useCallback((loc: GeoLocation) => {
    setCurrentLocId(loc.id)
    refetch(loc.id)
  }, [refetch])

  const handleRefresh = useCallback(() => {
    setCurrentLocId(undefined)
    requestLocation()
    refetch(locationId)
  }, [locationId, requestLocation, refetch])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-hero p-6 flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full spin" />
          <p className="text-sm text-glass-secondary">正在获取天气数据...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-hero p-6 flex flex-col items-center gap-3">
          <p className="text-sm text-glass-secondary">{error || '暂无数据'}</p>
          <button onClick={handleRefresh} className="glass-sm glass-hover px-4 py-2 text-sm text-glass-primary">
            重试
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* AI生成视频背景 */}
      <WeatherAnimation weatherType={data.current.weatherType} />

      {/* 内容层 - 横屏适配 */}
      <div className="relative z-10 min-h-screen">
        <div className="max-w-4xl lg:max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 space-y-4 md:space-y-6 pb-8">
          {/* 搜索栏 + 刷新 */}
          <header className="flex items-center gap-3 fade-in">
            <SearchBar onSelect={handleLocationSelect} />
            <button
              onClick={handleRefresh}
              className="glass-sm glass-hover p-2.5 shrink-0"
              title="刷新定位"
            >
              <svg className="w-5 h-5 text-glass-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 5a8 8 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </header>

          {/* 主天气 Hero - 大面积展示 */}
          <WeatherHero current={data.current} />

          {/* 逐时预报 */}
          <HourlyForecast hourly={data.hourly} />

          {/* 7天预报 */}
          <DailyForecast daily={data.daily} />

          {/* 详细指标 */}
          <WeatherDetails current={data.current} />

          {/* 生活建议 */}
          <LifeAdvice advice={data.lifeAdvice} />

          <footer className="text-center text-xs text-glass-dim pt-4 pb-6">
            天气ing · 数据来源中国气象局
          </footer>
        </div>
      </div>
    </div>
  )
}
