import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { APP_CONFIG } from './config'
import { angularDifference, getSkyPosition, getViewingScore, POLARIS, type SkyPosition } from './lib/astronomy'
import { requestCompassPermission, subscribeToCompass, type CompassState } from './lib/compass'
import { PRESET_LOCATIONS, requestLocation, type UserLocation } from './lib/location'
import { getWeather } from './lib/weather'
import { BottomNav } from './components/BottomNav'
import { LiveGuide } from './components/LiveGuide'
import { StarField } from './components/StarField'
import { StoryConstellation } from './components/StoryConstellation'
import { AnniversarySurprise } from './components/AnniversarySurprise'

type ViewState = {
  position: SkyPosition
  cloudCover: number | null
  updatedAt: Date
}

function App() {
  const [location, setLocation] = useState<UserLocation | null>(null)
  const [view, setView] = useState<ViewState | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [guideOpen, setGuideOpen] = useState(false)
  const [compass, setCompass] = useState<CompassState>({ heading: null, supported: true, precise: false })
  const [compassActive, setCompassActive] = useState(false)
  const [online, setOnline] = useState(() => navigator.onLine)

  const viewing = useMemo(
    () => view ? getViewingScore(view.position, view.cloudCover) : null,
    [view]
  )

  const difference = useMemo(() => {
    if (!view || compass.heading === null) return null
    return angularDifference(view.position.azimuth, compass.heading)
  }, [view, compass.heading])

  useEffect(() => {
    if (!compassActive) return
    return subscribeToCompass(setCompass)
  }, [compassActive])

  useEffect(() => {
    const goOnline = () => setOnline(true)
    const goOffline = () => setOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  async function calculateFor(nextLocation: UserLocation) {
    setLoading(true)
    setError(null)
    setLocation(nextLocation)

    try {
      const position = getSkyPosition(nextLocation.latitude, nextLocation.longitude)
      let cloudCover: number | null = null

      if (navigator.onLine) {
        try {
          cloudCover = (await getWeather(nextLocation.latitude, nextLocation.longitude)).cloudCover
        } catch {
          // El cálculo astronómico funciona aunque el clima no esté disponible.
        }
      }

      setView({ position, cloudCover, updatedAt: new Date() })
    } finally {
      setLoading(false)
    }
  }

  async function useMyLocation() {
    setLoading(true)
    setError(null)
    try {
      const found = await requestLocation()
      await calculateFor(found)
      window.setTimeout(() => document.querySelector('#encontrar')?.scrollIntoView({ behavior: 'smooth' }), 120)
    } catch (err) {
      setLoading(false)
      setError(err instanceof Error ? friendlyLocationError(err.message) : 'No pudimos obtener tu ubicación.')
    }
  }

  async function enableCompass() {
    setError(null)
    try {
      await requestCompassPermission()
      setCompassActive(true)
      if ('vibrate' in navigator) navigator.vibrate?.(20)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible activar la brújula.')
    }
  }

  const directionText = difference === null
    ? 'Activa la brújula para que te guíe.'
    : Math.abs(difference) <= 4
      ? 'La tienes enfrente. Mira hacia Estrellita ✦'
      : `Gira ${Math.round(Math.abs(difference))}° hacia la ${difference > 0 ? 'derecha' : 'izquierda'}.`

  return (
    <main className="app-shell">
      <StarField />

      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Ir al inicio">
          <span className="brand-mark">✦</span>
          <span>{APP_CONFIG.appName}</span>
        </a>
        <div className="topbar-right">
          <span className={`connection-pill ${online ? '' : 'offline'}`}><i /> {online ? 'En línea' : 'Sin conexión'}</span>
          <a className="ghost-link" href="#historia">Nuestra historia</a>
        </div>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-content">
          <div className="eyebrow"><span>✦</span> PARA {APP_CONFIG.nickname.toUpperCase()}</div>
          <h1>Tres años<br /><em>bajo el mismo cielo</em></h1>
          <p className="hero-copy">{APP_CONFIG.heroText}</p>

          <div className="anniversary-chip"><span>2023</span><i /><strong>3 años juntos</strong><i /><span>2026</span></div>

          <div className="hero-actions">
            <button className="primary-button" onClick={useMyLocation} disabled={loading}>
              <span>{loading ? '···' : '⌖'}</span>
              {loading ? 'Buscando Estrellita…' : 'Encontrar Estrellita'}
            </button>
            <a className="text-button" href="#historia">Recorrer nuestra historia <span>↓</span></a>
          </div>

          <p className="microcopy">
            <span>♡</span> Tu ubicación se usa para el cálculo astronómico y, si hay internet, para consultar nubosidad en Open‑Meteo. No la guardamos.
          </p>
        </div>

        <div className="polaris-stage" aria-label="Representación artística de Polaris">
          <div className="polaris-coordinate coordinate-top">α UMi</div>
          <div className="polaris-coordinate coordinate-bottom">89° 15′ 51″</div>
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit orbit-three" />
          <div className="polaris-beam" />
          <div className="polaris-glow" />
          <div className="polaris-star">✦</div>
          <div className="polaris-label">
            <small>NUESTRA ESTRELLA</small>
            <strong>Polaris</strong>
            <span>la que siempre vuelve al norte</span>
          </div>
        </div>

        <div className="hero-scroll" aria-hidden="true"><span>DESLIZA</span><i /></div>
      </section>

      <section className="finder-section section-wrap" id="encontrar">
        <SectionHeading index="01" kicker="ENCUÉNTRALA" title="¿Dónde está ahora?" />

        {!view ? (
          <div className="empty-card surface-card">
            <div className="empty-visual">
              <span className="empty-icon">⌖</span>
              <i />
            </div>
            <div className="empty-copy">
              <p className="card-label">LISTA PARA BUSCAR</p>
              <h3>Elige un lugar y te digo exactamente dónde mirar.</h3>
              <p>Polaris permanece sobre el horizonte tanto en Altavista como en Calgary. Su altura cambia casi junto con la latitud.</p>
              <div className="preset-row">
                {PRESET_LOCATIONS.map((preset, index) => (
                  <button key={preset.label} onClick={() => calculateFor(preset)}>
                    <span>{index === 0 ? '🇸🇻' : '🇨🇦'}</span>
                    <span>{index === 0 ? 'Altavista' : 'Calgary'}<small>{index === 0 ? 'El Salvador' : 'Canadá'}</small></span>
                    <b>→</b>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="finder-grid">
            <article className="status-card featured-card surface-card">
              <div className="card-topline">
                <span className="status-dot" />
                <span>{location?.label}</span>
                <small>actualizado {formatTime(view.updatedAt)}</small>
              </div>

              <div className="direction-layout">
                <div className="direction-copy">
                  <span className="direction-caption">MIRA HACIA</span>
                  <strong>{view.position.cardinal}</strong>
                  <small>{view.position.azimuth.toFixed(1)}° de azimut</small>
                </div>
                <div className="north-dial" style={{ '--star-angle': `${view.position.azimuth}deg` } as CSSProperties}>
                  <div className="dial-grid" />
                  <span className="dial-n">N</span>
                  <span className="dial-e">E</span>
                  <span className="dial-s">S</span>
                  <span className="dial-w">O</span>
                  <span className="dial-arrow">✦</span>
                  <i className="dial-center" />
                </div>
              </div>

              <div className="finder-stats">
                <div><span>Altura</span><strong>{view.position.altitude.toFixed(1)}°</strong><small>sobre el horizonte</small></div>
                <div><span>Cielo</span><strong>{capitalize(view.position.darkness)}</strong><small>según el Sol</small></div>
              </div>

              <button className="secondary-button" onClick={() => setGuideOpen(true)}>
                <span>⌁</span> Abrir guía en vivo <b>→</b>
              </button>
            </article>

            <article className="status-card condition-card surface-card">
              <div className="card-label-row"><span className="card-label">CONDICIONES AHORA</span><span className="tiny-star">✦</span></div>
              <div className="score-orbit" style={{ '--score': `${viewing?.score ?? 0}` } as CSSProperties}>
                <div><strong>{viewing?.score ?? '—'}</strong><small>/100</small></div>
              </div>
              <div className="condition-title"><strong>{viewing?.label}</strong><span>para verla</span></div>
              <dl className="metrics">
                <div><dt>Nubosidad</dt><dd>{view.cloudCover === null ? 'Sin datos' : `${Math.round(view.cloudCover)}%`}</dd></div>
                <div><dt>Altitud</dt><dd>{view.position.altitude.toFixed(1)}°</dd></div>
                <div><dt>Luz solar</dt><dd>{view.position.sunAltitude.toFixed(1)}°</dd></div>
              </dl>
              <p className="condition-note">{bestReason(viewing?.reasons)}</p>
              {view.cloudCover === null && <p className="offline-note">La posición de Polaris sí funciona sin internet; solo falta el dato de nubes.</p>}
            </article>
          </div>
        )}

        {error && <p className="error-message" role="alert">{error}</p>}
      </section>

      <section className="timeline-section section-wrap" id="historia">
        <SectionHeading index="02" kicker="NUESTRA HISTORIA" title="Desde 2023, una constelación de nosotros." />
        <div className="timeline-intro">
          <p>El inicio fue en 2023. Después llegaron nuestro primer, segundo y ahora tercer aniversario. Toca cada estrella para recorrer un capítulo.</p>
          <span>3 años · 4 capítulos</span>
        </div>
        <StoryConstellation />
      </section>

      <section className="same-sky section-wrap" id="juntos">
        <SectionHeading index="03" kicker="EL MISMO CIELO" title="Dos lugares. Una estrella." />
        <div className="same-sky-intro">
          <p>No importa cuántos kilómetros haya entre nosotros. Polaris es la forma fisica de recordarnos que no hay distancia que nos pueda separar.</p>
          <span>✦</span>
        </div>
        <div className="places-card surface-card">
          <LocationSky label="Altavista" country="El Salvador" flag="🇸🇻" location={PRESET_LOCATIONS[0]} />
          <div className="sky-connection" aria-hidden="true"><span>✦</span><i /><small>misma luz</small></div>
          <LocationSky label="Calgary" country="Canadá" flag="🇨🇦" location={PRESET_LOCATIONS[1]} />
        </div>
        <blockquote className="center-quote">“Aunque estemos en lugares distintos, podemos levantar la mirada y buscar la misma Estrellita.”</blockquote>
      </section>

      <section className="story-section section-wrap" id="polaris">
        <SectionHeading index="04" kicker="POR QUÉ POLARIS" title="Una estrella hecha para recordarnos." />
        <div className="story-grid">
          <article className="story-copy-card surface-card">
            <span className="story-kicker">PARA MI ESTRELLITA</span>
            <div className="quote-mark">“</div>
            <p>{APP_CONFIG.dedication}</p>
            <div className="signature-line"><i /><small>{APP_CONFIG.fromLabel}</small></div>
          </article>
          <article className="facts-card surface-card">
            <div className="facts-header"><span>✦</span><div><small>DATOS DE NUESTRA ESTRELLA</small><strong>Polaris</strong></div></div>
            <dl>
              <div><dt>Nombre real</dt><dd>{POLARIS.catalogName}</dd></div>
              <div><dt>Catálogo</dt><dd>{POLARIS.hip}</dd></div>
              <div><dt>Constelación</dt><dd>{POLARIS.constellation}</dd></div>
              <div><dt>Magnitud</dt><dd>{POLARIS.magnitude}</dd></div>
              <div><dt>Distancia aprox.</dt><dd>{Math.round(POLARIS.distanceLightYears)} años luz</dd></div>
            </dl>
          </article>
        </div>
      </section>

      <section className="closing-section section-wrap" id="sorpresa">
        <SectionHeading index="05" kicker="TERCER ANIVERSARIO" title="Una última cosa, Estrellita." />
        <AnniversarySurprise />
      </section>

      <footer>
        <span>✦</span>
        <p>{APP_CONFIG.appName} · {APP_CONFIG.yearsTogether} años bajo el mismo cielo</p>
        <small>PWA privada · hecha con amor y código</small>
      </footer>

      <BottomNav />

      {view && location && (
        <LiveGuide
          open={guideOpen}
          position={view.position}
          locationLabel={location.label}
          difference={difference}
          compass={compass}
          compassActive={compassActive}
          directionText={directionText}
          onEnableCompass={enableCompass}
          onClose={() => setGuideOpen(false)}
        />
      )}
    </main>
  )
}

function SectionHeading({ index, kicker, title }: { index: string; kicker: string; title: string }) {
  return (
    <div className="section-heading">
      <span className="section-index">{index}</span>
      <div><p className="kicker">{kicker}</p><h2>{title}</h2></div>
    </div>
  )
}

function LocationSky({ label, country, flag, location }: { label: string; country: string; flag: string; location: UserLocation }) {
  const position = getSkyPosition(location.latitude, location.longitude)
  const starBottom = Math.min(82, Math.max(12, position.altitude + 7))

  return (
    <div className="place">
      <div className="place-title">
        <span className="flag-orb">{flag}</span>
        <div><strong>{label}</strong><small>{country}</small></div>
      </div>
      <div className="mini-horizon">
        <span className="mini-cardinal">N</span>
        <span className="mini-star" style={{ bottom: `${starBottom}%` }}>✦</span>
        <i className="horizon-line" />
        <div className="horizon-glow" />
      </div>
      <div className="place-reading"><span>Polaris ahora</span><strong>{position.altitude.toFixed(1)}°</strong><small>sobre el horizonte norte</small></div>
    </div>
  )
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('es', { hour: '2-digit', minute: '2-digit' }).format(date)
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function bestReason(reasons?: string[]) {
  if (!reasons?.length) return 'Calculando las condiciones para observar.'
  return reasons.find((reason) => reason.includes('nubes')) ?? reasons[0]
}

function friendlyLocationError(message: string) {
  const normalized = message.toLowerCase()
  if (normalized.includes('denied') || normalized.includes('permission')) {
    return 'Necesito permiso de ubicación para calcular dónde está Estrellita. Puedes habilitarlo desde los permisos del navegador.'
  }
  if (normalized.includes('timeout')) return 'La ubicación tardó demasiado. Intenta de nuevo o usa Altavista/Calgary como prueba.'
  return message || 'No pudimos obtener tu ubicación.'
}

export default App
