import { useState, useEffect, useCallback } from 'react'
import type { WeatherData } from '@/data/types'
import { getWeatherData } from '@/data/dataService'

export function useWeather(locationId?: string) {
  const [data, setData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async (id?: string) => {
    setLoading(true)
    setError(null)
    try {
      const weatherData = await getWeatherData(id)
      setData(weatherData)
    } catch (e) {
      setError(e instanceof Error ? e.message : '获取天气数据失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData(locationId)
  }, [locationId, fetchData])

  return { data, loading, error, refetch: fetchData }
}
