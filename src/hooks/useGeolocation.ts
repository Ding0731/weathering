import { useState, useEffect, useCallback } from 'react'
import type { GeoLocation } from '@/data/types'
import { searchLocation } from '@/data/dataService'

interface GeoState {
  latitude: number | null
  longitude: number | null
  error: string | null
  loading: boolean
}

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=zh-CN`,
      { headers: { 'User-Agent': 'weathering-app' } },
    )
    const data = await res.json()
    const addr = data.address || {}
    const province = addr.state || addr.province || ''
    const city = addr.city || addr.town || addr.county || ''
    const district = addr.suburb || addr.district || addr.borough || addr.neighbourhood || ''
    const name = district || city || province || data.display_name || '未知位置'
    return name.replace(/市|省|区|县/g, (m: string, off: number, s: string) => {
      if (s.length - off > 1) return m
      return ''
    })
  } catch {
    return '定位成功'
  }
}

export function useGeolocation() {
  const [geo, setGeo] = useState<GeoState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  })
  const [locationId, setLocationId] = useState<string>('101020600')
  const [locationName, setLocationName] = useState<string>('定位中...')

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeo({ latitude: 31.23, longitude: 121.50, error: null, loading: false })
      reverseGeocode(31.23, 121.50).then(name => setLocationName(name || '上海 浦东'))
      return
    }

    setGeo(prev => ({ ...prev, loading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        setGeo({ latitude: lat, longitude: lon, error: null, loading: false })

        const geoName = await reverseGeocode(lat, lon)
        setLocationName(geoName)

        try {
          const locations = await searchLocation(`${lat},${lon}`)
          if (locations.length > 0) {
            setLocationId(locations[0].id)
            setLocationName(`${locations[0].city} ${locations[0].district}`)
          }
        } catch {
          setLocationId('101020600')
        }
      },
      async () => {
        setGeo({ latitude: 31.23, longitude: 121.50, error: '定位受限，使用默认位置', loading: false })
        setLocationId('101020600')
        const name = await reverseGeocode(31.23, 121.50)
        setLocationName(name || '上海 浦东')
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    )
  }, [])

  useEffect(() => {
    requestLocation()
  }, [requestLocation])

  return { geo, locationId, locationName, requestLocation }
}
