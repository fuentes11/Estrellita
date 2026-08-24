# Estrellita v0.3

PWA privada de aniversario construida con React + Vite + TypeScript.

Estrellita usa Polaris como la estrella simbólica de una relación que comenzó en **2023** y celebra su **tercer aniversario en 2026**. La app combina una experiencia romántica con geolocalización, cálculo astronómico, nubosidad, brújula y una historia interactiva.

## Lo nuevo en v0.3

- Hero de **3 años bajo el mismo cielo**.
- Constelación interactiva de la historia: 2023 → 2024 → 2025 → 2026.
- Tarjetas de recuerdos listas para personalizar con textos y fotos.
- Sección Altavista, El Salvador ↔ Calgary, Canadá.
- Sorpresa final que se desbloquea tocando Polaris tres veces.
- PWA preparada para GitHub Pages.

## Personalizar los recuerdos

Edita `src/data/story.ts`. Cada capítulo puede incluir un `image` opcional. Coloca las fotos dentro de `public/memories/` y usa, por ejemplo:

```ts
image: '/memories/2023.jpg'
```

Si el proyecto se publica bajo un subdirectorio de GitHub Pages, conviene importar las imágenes desde `src/assets` o usar el `BASE_URL` de Vite para que las rutas respeten el `base` configurado.

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
