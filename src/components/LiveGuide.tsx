import { useEffect } from 'react'
import type { CompassState } from '../lib/compass'
import type { SkyPosition } from '../lib/astronomy'

interface LiveGuideProps {
  open: boolean
  position: SkyPosition
  locationLabel: string
  difference: number | null
  compass: CompassState
  compassActive: boolean
  directionText: string
  onEnableCompass: () => void
  onClose: () => void
}

export function LiveGuide({
  open,
  position,
  locationLabel,
  difference,
  compass,
  compassActive,
  directionText,
  onEnableCompass,
  onClose
}: LiveGuideProps) {
  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  const alignment = difference === null ? 0 : Math.max(0, 100 - Math.min(100, Math.abs(difference) * 2.4))
  const aligned = difference !== null && Math.abs(difference) <= 4

  return (
    <div className="guide-backdrop" role="dialog" aria-modal="true" aria-label="Guía para encontrar Estrellita" onMouseDown={onClose}>
      <div className="guide-sheet" onMouseDown={(event) => event.stopPropagation()}>
        <div className="guide-grabber" aria-hidden="true" />
        <button className="modal-close" onClick={onClose} aria-label="Cerrar guía">×</button>

        <div className="guide-header">
          <span className="live-badge"><i /> GUÍA EN VIVO</span>
          <h2>Encuentra Estrellita</h2>
          <p>⌖ {locationLabel}</p>
        </div>

        <div className={`guide-compass ${aligned ? 'is-aligned' : ''}`}>
          <span className="guide-cardinal guide-n">N</span>
          <span className="guide-cardinal guide-e">E</span>
          <span className="guide-cardinal guide-s">S</span>
          <span className="guide-cardinal guide-w">O</span>
          <div className="guide-ring guide-ring-outer" />
          <div className="guide-ring guide-ring-inner" />
          <div className="target-line" style={{ transform: `rotate(${difference ?? 0}deg)` }}>
            <span className="target-star">✦</span>
          </div>
          <div className="guide-center">
            <span>↑</span>
            <small>TÚ</small>
          </div>
        </div>

        <div className="alignment-track" aria-label={`Alineación aproximada ${Math.round(alignment)}%`}>
          <span style={{ width: `${alignment}%` }} />
        </div>

        <strong className="guide-instruction">{directionText}</strong>
        <p className="guide-detail">
          Cuando estés orientado al norte, levanta la mirada aproximadamente <b>{position.altitude.toFixed(0)}°</b> sobre el horizonte.
        </p>

        {!compassActive ? (
          <button className="primary-button compact" onClick={onEnableCompass}>
            <span>⌁</span> Activar brújula
          </button>
        ) : (
          <div className="compass-meta">
            <div>
              <span>Tu rumbo</span>
              <strong>{compass.heading === null ? '—' : `${compass.heading.toFixed(0)}°`}</strong>
            </div>
            <div>
              <span>Objetivo</span>
              <strong>{position.azimuth.toFixed(0)}°</strong>
            </div>
            <small>{compass.precise ? 'Sensor de orientación activo.' : 'Orientación aproximada; confirma visualmente en el cielo.'}</small>
          </div>
        )}
      </div>
    </div>
  )
}
