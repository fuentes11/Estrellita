const NAV_ITEMS = [
  { href: '#inicio', icon: '✦', label: 'Inicio' },
  { href: '#encontrar', icon: '⌖', label: 'Encontrar' },
  { href: '#historia', icon: '⋯', label: 'Historia' },
  { href: '#juntos', icon: '∞', label: 'Juntos' },
  { href: '#polaris', icon: '♡', label: 'Polaris' }
]

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      {NAV_ITEMS.map((item) => (
        <a key={item.href} href={item.href}>
          <span aria-hidden="true">{item.icon}</span>
          <small>{item.label}</small>
        </a>
      ))}
    </nav>
  )
}
