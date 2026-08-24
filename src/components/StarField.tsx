const STARS = Array.from({ length: 76 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  top: `${(i * 53 + 7) % 96}%`,
  size: `${0.8 + (i % 4) * 0.55}px`,
  opacity: 0.28 + (i % 5) * 0.12,
  delay: `${(i % 10) * 0.31}s`,
  duration: `${3.4 + (i % 7) * 0.45}s`
}))

export function StarField() {
  return (
    <div className="star-field" aria-hidden="true">
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      {STARS.map((star, index) => (
        <i
          key={index}
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDelay: star.delay,
            animationDuration: star.duration
          }}
        />
      ))}
      <div className="shooting-star shooting-star-one" />
      <div className="shooting-star shooting-star-two" />
    </div>
  )
}
