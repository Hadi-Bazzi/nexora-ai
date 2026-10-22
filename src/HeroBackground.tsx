import { useState } from 'react'
import { useReducedMotion } from 'framer-motion'

export default function HeroBackground() {
  const reducedMotion = useReducedMotion()
  const [videoUnavailable, setVideoUnavailable] = useState(false)
  const poster = '/videos/nexora-hero-poster.svg'

  if (reducedMotion || videoUnavailable) {
    return <img className="hero-motion-background hero-motion-poster" src={poster} alt="" aria-hidden="true" />
  }

  return <video
    className="hero-motion-background"
    src="/videos/nexora-hero.mp4"
    poster={poster}
    autoPlay
    muted
    loop
    playsInline
    preload="auto"
    aria-hidden="true"
    onError={() => setVideoUnavailable(true)}
  />
}
