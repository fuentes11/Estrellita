import { useState } from 'react'
import { STORY_CHAPTERS } from '../data/story'

export function StoryConstellation() {
  const [selectedYear, setSelectedYear] = useState(STORY_CHAPTERS[0].year)
  const chapter = STORY_CHAPTERS.find((item) => item.year === selectedYear) ?? STORY_CHAPTERS[0]

  return (
    <div className="story-experience">
      <div className="constellation-map surface-card" aria-label="Línea del tiempo de nuestra historia desde 2023">
        <div className="constellation-intro">
          <span className="card-label">NUESTRA CONSTELACIÓN</span>
          <p>Cuatro capítulos de calendario. Tres años juntos.</p>
        </div>

        <div className="story-path" aria-label="Selecciona un año">
          <div className="story-path-line" aria-hidden="true" />
          {STORY_CHAPTERS.map((item, index) => {
            const active = item.year === selectedYear
            const visited = item.year <= selectedYear
            return (
              <button
                className={`story-node node-${index + 1} ${active ? 'active' : ''} ${visited ? 'visited' : ''}`}
                key={item.year}
                onClick={() => setSelectedYear(item.year)}
                aria-pressed={active}
                aria-label={`${item.year}: ${item.anniversary}`}
              >
                <span className="node-star">✦</span>
                <strong>{item.year}</strong>
                <small>{item.anniversary}</small>
              </button>
            )
          })}
          <span className="constellation-polaris" aria-hidden="true">✦</span>
        </div>
      </div>

      <article className="memory-card surface-card" key={chapter.year}>
        <div className={`memory-visual ${chapter.image ? 'has-image' : ''}`}>
          {chapter.image ? (
            <img src={chapter.image} alt={`Recuerdo de ${chapter.year}`} />
          ) : (
            <>
              <span className="memory-year">{chapter.year}</span>
              <div className="memory-orbit orbit-a" />
              <div className="memory-orbit orbit-b" />
              <span className="memory-star">✦</span>
            </>
          )}
        </div>
        <div className="memory-copy">
          <div className="memory-meta">
            <span>{chapter.anniversary}</span>
            <i />
            <small>{chapter.note}</small>
          </div>
          <h3>{chapter.title}</h3>
          <p>{chapter.text}</p>
          <div className="memory-progress" aria-label={`Capítulo ${STORY_CHAPTERS.indexOf(chapter) + 1} de ${STORY_CHAPTERS.length}`}>
            {STORY_CHAPTERS.map((item) => (
              <button
                key={item.year}
                className={item.year === selectedYear ? 'active' : ''}
                onClick={() => setSelectedYear(item.year)}
                aria-label={`Ir a ${item.year}`}
              />
            ))}
          </div>
        </div>
      </article>
    </div>
  )
}
