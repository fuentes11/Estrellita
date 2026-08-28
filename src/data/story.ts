export type StoryChapter = {
  year: number
  anniversary: string
  title: string
  text: string
  note: string
  image?: string
}
const BASE = import.meta.env.BASE_URL

// Esta es la parte más fácil de personalizar después con recuerdos reales.
// Si agregas `image: '/memories/archivo.jpg'`, la tarjeta mostrará esa foto.
export const STORY_CHAPTERS: StoryChapter[] = [
  {
    year: 2023,
    anniversary: 'El comienzo',
    title: 'Aquí empezó nuestra historia.',
    text: 'El año en que comenzamos a escribir algo que hoy sigo eligiendo. Desde aquí, cada vuelta al Sol empezó a tener un significado distinto.',
    note: 'Capítulo 01 · Nuestro inicio',
    image:'./memories/2023.jpeg'
  },
  {
    year: 2024,
    anniversary: '1 año',
    title: 'Nuestra primera vuelta al Sol.',
    text: 'Un año de conocernos más, acompañarnos y guardar momentos que poco a poco comenzaron a convertirse en nuestra propia constelación.',
    note: 'Capítulo 02 · Primer aniversario',
    image:'../../memories/2024.jpeg'
  },
  {
    year: 2025,
    anniversary: '2 años',
    title: 'Dos años, y todavía escogiendo la misma luz.',
    text: 'La historia siguió creciendo. Con días fáciles, días difíciles y esa certeza bonita de saber que todavía había mucho cielo por compartir.',
    note: 'Capítulo 03 · Segundo aniversario',
    image:'${BASE}memories/2025.jpeg'
  },
  {
    year: 2026,
    anniversary: '3 años',
    title: 'Tres años bajo el mismo cielo.',
    text: 'Hoy miro hacia atrás y veo todo lo que hemos recorrido desde 2023. (incluso antes) Y cuando miro hacia arriba, Polaris sigue ahí para recordarme que esta historia todavía tiene muchas noches por delante.',
    note: 'Capítulo 04 · Tercer aniversario',
    image:'${BASE}memories/2026.jpeg'
  }
]
