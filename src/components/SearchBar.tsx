import { useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import type { GeoLocation } from '@/data/types'
import { searchLocation } from '@/data/dataService'

interface SearchBarProps {
  onSelect: (location: GeoLocation) => void
  currentLocation: string
}

export default function SearchBar({ onSelect, currentLocation }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeoLocation[]>([])
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSearch = useCallback(async (value: string) => {
    if (value.length < 2) {
      setResults([])
      setShowResults(false)
      return
    }
    setLoading(true)
    try {
      const locations = await searchLocation(value)
      setResults(locations)
      setShowResults(locations.length > 0)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => handleSearch(value), 300)
  }, [handleSearch])

  const handleSelect = useCallback((loc: GeoLocation) => {
    onSelect(loc)
    setQuery('')
    setShowResults(false)
  }, [onSelect])

  return (
    <div className="relative w-full">
      <div className="glass flex items-center gap-2 px-3 py-2">
        <svg className="w-4 h-4 glass-text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => results.length > 0 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          placeholder="搜索区县天气..."
          className="w-full bg-transparent glass-text placeholder:text-white/30 outline-none text-sm"
        />
        {loading && (
          <motion.div
            className="w-3.5 h-3.5 border-2 border-white/20 border-t-white/60 rounded-full shrink-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </div>

      {showResults && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full mt-1 w-full glass overflow-hidden z-50 shadow-2xl"
        >
          {results.map(loc => (
            <button
              key={loc.id}
              onClick={() => handleSelect(loc)}
              className="w-full px-3 py-2.5 text-left hover:bg-white/10 transition-colors flex items-center justify-between text-sm glass-text"
            >
              <span>{loc.province} {loc.city} {loc.district}</span>
              <span className="glass-text-muted text-xs">{loc.latitude.toFixed(2)}N</span>
            </button>
          ))}
        </motion.div>
      )}

      <div className="mt-1.5 text-[11px] glass-text-muted flex items-center gap-1">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {currentLocation}
      </div>
    </div>
  )
}
