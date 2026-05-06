import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  opacitySpeed: number
  rotation: number
  rotationSpeed: number
  shape: 'diamond' | 'star' | 'circle'
  color: string
}

const COLORS = [
  'rgba(201,168,76,',   // gold
  'rgba(232,201,106,',  // gold light
  'rgba(255,220,100,',  // bright gold
  'rgba(180,140,50,',   // dark gold
  'rgba(255,245,180,',  // near-white gold
]

function createParticle(w: number, h: number): Particle {
  const shape = (['diamond', 'star', 'circle'] as const)[Math.floor(Math.random() * 3)]
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    size: Math.random() * 3.5 + 1,
    speedX: (Math.random() - 0.5) * 0.35,
    speedY: Math.random() * -0.6 - 0.15,
    opacity: Math.random(),
    opacitySpeed: Math.random() * 0.012 + 0.004,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.04,
    shape,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }
}

function drawDiamond(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.beginPath()
  ctx.moveTo(0, -size)
  ctx.lineTo(size * 0.6, 0)
  ctx.lineTo(0, size)
  ctx.lineTo(-size * 0.6, 0)
  ctx.closePath()
  ctx.restore()
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.beginPath()
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2
    ctx.moveTo(0, 0)
    ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size)
  }
  ctx.restore()
}

export default function GlitterCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const PARTICLE_COUNT = 140

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = document.documentElement.scrollHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () =>
      createParticle(canvas.width, canvas.height)
    )

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(p => {
        p.x += p.speedX
        p.y += p.speedY
        p.rotation += p.rotationSpeed
        p.opacity += p.opacitySpeed

        if (p.opacity >= 1 || p.opacity <= 0) {
          p.opacitySpeed *= -1
        }

        // reset if drifted off top
        if (p.y < -10) {
          p.y = canvas.height + 10
          p.x = Math.random() * canvas.width
        }
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10

        const alpha = Math.max(0, Math.min(1, p.opacity))
        ctx.fillStyle = p.color + alpha + ')'
        ctx.strokeStyle = p.color + alpha + ')'
        ctx.lineWidth = 0.8

        if (p.shape === 'diamond') {
          drawDiamond(ctx, p.x, p.y, p.size, p.rotation)
          ctx.fill()
        } else if (p.shape === 'star') {
          ctx.lineWidth = p.size * 0.5
          drawStar(ctx, p.x, p.y, p.size * 1.2, p.rotation)
          ctx.stroke()
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      animId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.55,
      }}
    />
  )
}
