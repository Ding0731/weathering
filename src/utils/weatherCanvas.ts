import type { WeatherType } from '@/data/types'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  life: number
  maxLife: number
  extra?: Record<string, number>
}

const BG_COLORS: Record<WeatherType, [string, string]> = {
  sunny: ['#f97316', '#fbbf24'],
  partly_cloudy: ['#6366f1', '#a5b4fc'],
  cloudy: ['#475569', '#94a3b8'],
  overcast: ['#334155', '#64748b'],
  light_rain: ['#1e40af', '#60a5fa'],
  moderate_rain: ['#1e3a5f', '#3b82f6'],
  heavy_rain: ['#0c1445', '#1d4ed8'],
  thunderstorm: ['#312e81', '#4c1d95'],
  snow: ['#7dd3fc', '#e0f2fe'],
  fog: ['#94a3b8', '#e2e8f0'],
  haze: ['#a16207', '#d4a017'],
  windy: ['#0c4a6e', '#0ea5e9'],
}

export function createParticleSystem(weatherType: WeatherType, w: number, h: number) {
  const particles: Particle[] = []
  const type = weatherType

  function initParticles() {
    particles.length = 0
    switch (type) {
      case 'sunny':
        for (let i = 0; i < 20; i++) {
          particles.push({
            x: Math.random() * w, y: Math.random() * h,
            vx: 0, vy: 0, size: 2 + Math.random() * 4,
            opacity: 0.2 + Math.random() * 0.3, life: 0,
            maxLife: 120 + Math.random() * 80,
          })
        }
        break
      case 'partly_cloudy':
        for (let i = 0; i < 12; i++) {
          particles.push({
            x: Math.random() * w, y: Math.random() * h,
            vx: 0, vy: 0, size: 2 + Math.random() * 3,
            opacity: 0.15 + Math.random() * 0.2, life: 0,
            maxLife: 120 + Math.random() * 80,
          })
        }
        for (let i = 0; i < 4; i++) {
          particles.push({
            x: Math.random() * w, y: h * (0.1 + i * 0.18),
            vx: 0.3 + Math.random() * 0.2, vy: 0,
            size: 80 + i * 30, opacity: 0.06 + i * 0.02, life: 0,
            maxLife: 9999, extra: { cloudIndex: i },
          })
        }
        break
      case 'cloudy': case 'overcast':
        for (let i = 0; i < 6; i++) {
          particles.push({
            x: Math.random() * w * 0.5, y: h * (0.08 + i * 0.15),
            vx: 0.2 + Math.random() * 0.3, vy: 0,
            size: 100 + i * 40, opacity: 0.08 + i * 0.02, life: 0,
            maxLife: 9999, extra: { cloudIndex: i },
          })
        }
        break
      case 'light_rain':
        for (let i = 0; i < 60; i++) {
          particles.push({
            x: Math.random() * w, y: Math.random() * h * -0.2,
            vx: -0.5, vy: 4 + Math.random() * 2,
            size: 1, opacity: 0.3 + Math.random() * 0.2, life: 0,
            maxLife: Math.floor(h / vy) + 10,
          })
        }
        break
      case 'moderate_rain': case 'heavy_rain':
        for (let i = 0; i < 100; i++) {
          particles.push({
            x: Math.random() * w, y: Math.random() * h * -0.3,
            vx: -0.8, vy: 6 + Math.random() * 3,
            size: 1.5, opacity: 0.35 + Math.random() * 0.25, life: 0,
            maxLife: Math.floor(h / vy) + 10,
          })
        }
        break
      case 'thunderstorm':
        for (let i = 0; i < 80; i++) {
          particles.push({
            x: Math.random() * w, y: Math.random() * h * -0.3,
            vx: -1, vy: 7 + Math.random() * 3,
            size: 1.5, opacity: 0.4 + Math.random() * 0.2, life: 0,
            maxLife: Math.floor(h / vy) + 10,
          })
        }
        break
      case 'snow':
        for (let i = 0; i < 50; i++) {
          particles.push({
            x: Math.random() * w, y: Math.random() * h * -0.2,
            vx: (Math.random() - 0.5) * 0.5, vy: 1 + Math.random() * 1.5,
            size: 2 + Math.random() * 3, opacity: 0.4 + Math.random() * 0.3, life: 0,
            maxLife: Math.floor(h / Math.max(vy, 0.5)) + 20,
            extra: { wobble: Math.random() * 6.28 },
          })
        }
        break
      case 'fog': case 'haze':
        for (let i = 0; i < 5; i++) {
          particles.push({
            x: w * (0.2 + i * 0.15), y: h * (0.1 + i * 0.16),
            vx: 0.15 + Math.random() * 0.1, vy: 0,
            size: 150 + i * 50, opacity: 0.04 + i * 0.01, life: 0,
            maxLife: 9999, extra: { fogIndex: i },
          })
        }
        break
      case 'windy':
        for (let i = 0; i < 15; i++) {
          particles.push({
            x: Math.random() * w * -0.1, y: h * (0.1 + Math.random() * 0.7),
            vx: 3 + Math.random() * 2, vy: (Math.random() - 0.5) * 0.5,
            size: 30 + Math.random() * 20, opacity: 0.1 + Math.random() * 0.15, life: 0,
            maxLife: Math.floor(w / Math.max(vx, 1)) + 5,
          })
        }
        break
    }
  }

  initParticles()

  function update(speed: number) {
    const s = speed
    for (const p of particles) {
      p.x += p.vx * s
      p.y += p.vy * s
      p.life += s

      if (p.extra?.wobble) {
        p.extra.wobble += 0.02 * s
        p.x += Math.sin(p.extra.wobble) * 0.5 * s
      }

      if (p.maxLife < 9999 && p.life > p.maxLife) {
        p.x = Math.random() * w
        p.y = -Math.random() * h * 0.3
        p.life = 0
      }
      if (p.vx > 0 && p.x > w + p.size) {
        p.x = -p.size
        p.life = 0
      }
      if (p.vx < 0 && p.x < -p.size) {
        p.x = w + p.size
        p.life = 0
      }
    }
  }

  function draw(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, w, h)

    for (const p of particles) {
      ctx.globalAlpha = p.opacity

      if (p.extra?.cloudIndex !== undefined || p.extra?.fogIndex !== undefined) {
        ctx.fillStyle = 'rgba(255,255,255,0.5)'
        ctx.beginPath()
        const r = p.size
        ctx.ellipse(p.x, p.y, r, r * 0.35, 0, 0, Math.PI * 2)
        ctx.fill()
      } else if (type === 'sunny' || type === 'partly_cloudy') {
        ctx.fillStyle = '#fbbf24'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      } else if (type.includes('rain') || type === 'thunderstorm') {
        ctx.strokeStyle = 'rgba(147,197,253,0.6)'
        ctx.lineWidth = p.size
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x + p.vx * 2, p.y + p.vy * 2)
        ctx.stroke()
      } else if (type === 'snow') {
        ctx.fillStyle = 'rgba(255,255,255,0.8)'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      } else if (type === 'windy') {
        ctx.strokeStyle = 'rgba(255,255,255,0.3)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x + p.size, p.y)
        ctx.stroke()
      }
    }
    ctx.globalAlpha = 1
  }

  function resize(newW: number, newH: number) {
    w = newW
    h = newH
    initParticles()
  }

  return { update, draw, resize }
}

export function drawBackground(ctx: CanvasRenderingContext2D, weatherType: WeatherType, w: number, h: number, t: number) {
  const [c1, c2] = BG_COLORS[weatherType] || BG_COLORS.partly_cloudy
  const grd = ctx.createLinearGradient(0, 0, w * 0.5, h)
  grd.addColorStop(0, c1)
  grd.addColorStop(1, c2)
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, w, h)

  if (weatherType === 'thunderstorm' && Math.random() < 0.003) {
    ctx.fillStyle = 'rgba(200,200,255,0.15)'
    ctx.fillRect(0, 0, w, h)
  }

  if (weatherType === 'sunny') {
    ctx.globalAlpha = 0.2 + Math.sin(t * 0.01) * 0.1
    ctx.fillStyle = '#fbbf24'
    ctx.beginPath()
    ctx.arc(w * 0.82, h * 0.08, 50 + Math.sin(t * 0.008) * 10, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }
}
