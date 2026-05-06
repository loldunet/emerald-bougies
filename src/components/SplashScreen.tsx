import { useEffect, useState } from 'react'

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setFading(true), 2200)
    const done = setTimeout(() => onDone(), 2900)
    return () => { clearTimeout(timer); clearTimeout(done) }
  }, [onDone])

  return (
    <div className={`splash${fading ? ' splash--out' : ''}`}>
      <div className="splash__inner">
        <img src="/logo.png" alt="Emerald Bougies" className="splash__logo" />
        <p className="splash__tagline">Énergie & Harmonie</p>
        <div className="splash__bar">
          <div className="splash__bar-fill" />
        </div>
      </div>
    </div>
  )
}
