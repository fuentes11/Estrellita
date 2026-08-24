import { useState, type CSSProperties } from 'react'
import { APP_CONFIG } from '../config'

const HEART_STARS = [
  [28, 21], [39, 14], [50, 21], [61, 14], [72, 21],
  [20, 34], [80, 34], [23, 48], [77, 48], [30, 61],
  [70, 61], [39, 73], [61, 73], [50, 84]
] as const

export function AnniversarySurprise() {
  const [taps, setTaps] = useState(0)
  const revealed = taps >= 3

  function touchStar() {
    if (revealed) return
    const next = taps + 1
    setTaps(next)
    if ('vibrate' in navigator) navigator.vibrate?.(next === 3 ? [30, 50, 70] : 18)
  }

  const hint = taps === 0
    ? 'Hay una última cosa que Polaris quiere mostrarte.'
    : taps === 1
      ? 'Una vez más…'
      : taps === 2
        ? 'La última ✦'
        : ''

  return (
    <section className={`surprise-card surface-card ${revealed ? 'revealed' : ''}`} aria-live="polite">
      <div className="heart-sky" aria-hidden="true">
        {HEART_STARS.map(([left, top], index) => (
          <i key={`${left}-${top}`} style={{ left: `${left}%`, top: `${top}%`, '--delay': `${index * 45}ms` } as CSSProperties}>✦</i>
        ))}
        <div className="heart-center-glow" />
        <button className="secret-polaris" onClick={touchStar} tabIndex={-1} aria-hidden="true">✦</button>
      </div>

      <div className="surprise-copy">
        {!revealed ? (
          <>
            <span className="card-label">UNA ÚLTIMA ESTRELLA</span>
            <h3>{hint}</h3>
            <p>Tócala tres veces.</p>
            <button className="surprise-trigger" onClick={touchStar} aria-label={`Tocar Polaris. ${taps} de 3 toques`}>
              <span>✦</span>
              <small>{taps}/3</small>
            </button>
          </>
        ) : (
          <div className="final-reveal">
            <span className="final-kicker">2023 — 2026</span>
            <strong>3 años</strong>
            <h3>y todavía quiero seguir encontrándote.</h3>
            <p>{APP_CONFIG.finalMessage}</p>
            <small>Feliz tercer aniversario, mi Estrellita. ♡</small>
          </div>
        )}
      </div>
    </section>
  )
}
