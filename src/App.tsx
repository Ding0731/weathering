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
import AQIDisplay from '@/components/AQIDisplay'
import LifeAdvice from '@/components/LifeAdvice'

export default function App() {
  const { locationId, locationName, requestLocation } = useGeolocation()
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
      <div className="min-h-screen flex items-center justify-center bg-indigo-900/80">
        <div className="glass p-6 flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full spin" />
          <p className="text-sm glass-text-secondary">正在获取天气数据...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-700/80">
        <div className="glass p-6 flex flex-col items-center gap-3">
          <p className="text-sm glass-text-secondary">{error || '暂无数据'}</p>
          <button onClick={handleRefresh} className="glass-sm glass-hover px-4 py-2 text-sm glass-text">
            重试
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <WeatherAnimation weatherType={data.current.weatherType} />

      <div className="relative z-10 min-h-screen">
        <div className="max-w-lg mx-auto px-4 py-6 space-y-4 pb-8">
          <header className="flex items-center justify-between fade-in">
            <SearchBar onSelect={handleLocationSelect} currentLocation={locationName} />
            <button onClick={handleRefresh} className="glass-sm glass-hover p-2 ml-2" title="刷新定位">
              <svg className="w-4 h-4 glass-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 5a8 8 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </header>

          <WeatherHero current={data.current} />
          <AQIDisplay current={data.current} />
          <HourlyForecast hourly={data.hourly} />
          <DailyForecast daily={data.daily} />
          <WeatherDetails current={data.current} />
          <LifeAdvice advice={data.lifeAdvice} />

          <footer className="text-center text-[11px] glass-text-muted opacity-40 pt-2 pb-6">
            天气ing · 数据来源和风天气
          </footer>
        </div>
      </div>
    </div>
  )
}
