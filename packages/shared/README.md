# @nathy/shared

Coleção de componentes, ícones, hooks e estilos compartilhados.

## Instalação

- Adicione as dependências peer no app consumidor:
  - react, react-dom (v18+ ou v19)
- Importe os estilos globais em seu app (uma única vez):

```ts
// ex.: apps/web/src/app/layout.tsx
import '@nathy/shared/style.css'
```

Ou, se preferir PostCSS/Tailwind por pacote, aponte o postcss/tailwind do app para o @nathy/shared.

## Importação

- UI básica:
```ts
import { Button } from '@nathy/shared/ui/button'
import { Card, CardContent } from '@nathy/shared/ui/card'
```

- UI animada:
```ts
import { Sidebar, SidebarProvider } from '@nathy/shared/ui/animated/sidebar'
import { Sheet, SheetContent } from '@nathy/shared/ui/animated/sheet'
```

- Hooks e utils:
```ts
import { useIsInView } from '@nathy/shared/hooks/use-is-in-view'
import { cn } from '@nathy/shared/lib/utils'
```

## Temas

Os temas usam data-theme no elemento html/body e variam por esquema light/dark via next-themes ou classe .light/.dark.

- Para alterar a cor:
```ts
// cliente
document.documentElement.dataset.theme = 'purple' // default, purple, blue, green, teal, crimson
```

- Para alterar o esquema (light/dark), use a classe .light/.dark no html/body.

## Desenvolvimento

- Scripts úteis:
```bash
pnpm -w run -r build     # build workspace
pnpm --filter @nathy/shared run typecheck
pnpm --filter @nathy/shared run lint
```
