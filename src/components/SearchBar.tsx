import { useState, useCallback, useRef } from 'react'
import type { GeoLocation } from '@/data/types'
import { searchLocation } from '@/data/dataService'

interface SearchBarProps {
  onSelect: (location: GeoLocation) => void
}

export default function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeoLocation[]>([])
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSearch = useCallback(async (value: string) => {
    if (value.length < 2) { setResults([]); setShowResults(false); return }
    setLoading(true)
    try {
      const locations = await searchLocation(value)
      setResults(locations)
      setShowResults(locations.length > 0)
    } catch { setResults([]) }
    finally { setLoading(false) }
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
      <div className="glass flex items-center gap-2 px-4 py-3">
        <svg className="w-4 h-4 text-glass-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => results.length > 0 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          placeholder="搜索区县天气..."
          className="w-full bg-transparent text-glass-primary placeholder:text-white/30 outline-none text-sm md:text-base"
        />
        {loading && (
          <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full spin shrink-0" />
        )}
      </div>

      {showResults && (
        <div className="absolute top-full mt-2 w-full glass overflow-hidden z-50 shadow-2xl fade-in">
          {results.map(loc => (
            <button
              key={loc.id}
              onClick={() => handleSelect(loc)}
              className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors flex items-center justify-between text-sm text-glass-primary"
            >
              <span>{loc.province} {loc.city} {loc.district}</span>
              <span className="text-glass-muted text-xs">{loc.latitude.toFixed(2)}N</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
