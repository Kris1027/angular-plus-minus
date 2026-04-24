# Plus / Minus

A single-page decision helper. Enter a topic (e.g. _"new job"_), log pluses and
minuses in two columns, and see a live verdict based on counts.

## Features

- **Single topic, two columns** — plus / minus dashboards side by side, stacked
  on mobile
- **Editable topic** — auto-growing textarea (`field-sizing: content`), Enter
  commits and blurs
- **Per-item controls** — add, inline-edit (double-click or pencil icon),
  delete, and drag-to-reorder with `@angular/cdk` drag-drop
- **Live verdict** — computed counts and a "Pluses win / Minuses win / Tied"
  badge; the summary background shifts with the outcome
- **localStorage persistence** — state survives reloads under
  `plus-minus:v1`, SSR-safe via `isPlatformBrowser`
- **Reset** — icon button, disabled when the app is empty, confirms via a
  native `<dialog>` with focus trap and Escape-to-close
- **Dark mode** — class-based toggle with `localStorage['theme']` persistence,
  initial state falls back to OS `prefers-color-scheme`; inline head script
  prevents flash-of-wrong-theme on reload
- **Custom palette** — oklch `jade` and `clay` scales (11 shades each) defined
  in `@theme`, paired with the warm stone neutral
- **Typography** — Space Grotesk via Google Fonts, variable `300..700`

## Stack

Angular 21 (standalone components, signals) · TypeScript 5.9 strict · Tailwind
CSS v4 · `@angular/cdk` · Express SSR · Vitest · ESLint flat config
(`angular-eslint`, `typescript-eslint`, `eslint-config-prettier`) · Prettier
with `prettier-plugin-tailwindcss` · pnpm.

## Scripts

```bash
pnpm start          # dev server on http://localhost:4200
pnpm build          # production build (browser + SSR bundles → dist/)
pnpm test           # Vitest unit tests via ng test
pnpm lint           # ESLint over .ts and .html
pnpm typecheck      # tsc -b --noEmit (app + spec projects)
pnpm format         # prettier --write .
pnpm format:check   # prettier --check .
pnpm validate       # format:check → lint → typecheck → build
pnpm serve:ssr:plusminus  # run the built SSR server
```

## Project structure

```
src/
├── app/
│   ├── app.ts / app.html              # shell: header, topic, main, footer
│   ├── app.spec.ts
│   ├── decision/
│   │   ├── decision.types.ts          # Kind, DecisionItem, DecisionState, Verdict
│   │   ├── decision-store.ts          # signal store + localStorage effect
│   │   ├── decision-store.spec.ts
│   │   ├── dashboard.ts / .html       # one column (plus or minus)
│   │   ├── item-form.ts / .html       # add input
│   │   ├── item-card.ts / .html       # single row (drag, edit, delete)
│   │   └── summary.ts / .html         # verdict section
│   └── theme/
│       ├── theme-store.ts             # signal store + html.dark sync
│       └── theme-toggle.ts / .html    # icon button
├── styles.css                         # Tailwind import + @theme palette
├── index.html                         # contains FOUC-prevention script
├── main.ts / main.server.ts / server.ts
└── server.ts                          # Express SSR entry
```

## Architecture

State lives in two `@Injectable({ providedIn: 'root' })` signal stores:

- **`DecisionStore`** — holds `{ topic, pluses, minuses }`. Exposes `computed`
  signals for counts and the verdict. A single `effect()` writes the state to
  `localStorage` on every change. CRUD methods return immutable updates via
  `.update()`.
- **`ThemeStore`** — holds `'light' | 'dark'`. The `effect()` toggles the
  `dark` class on `<html>` and persists the choice. Initial value resolves
  from `localStorage` → `window.matchMedia('(prefers-color-scheme: dark)')` →
  `'light'`.

The template uses new Angular 21 features: `input.required()`, `viewChild()`,
`@let`, `@for`/`@if`/`@empty`, and `field-sizing-content` via Tailwind.

SSR is configured to prerender the root route; browser-only APIs
(`localStorage`, `matchMedia`, `HTMLDialogElement.showModal`) are gated by
`isPlatformBrowser(inject(PLATFORM_ID))` or runtime checks. An inline script
in `index.html` applies the stored theme class before the first paint so
there is no FOUC on reload.

## Testing

Vitest runs under `jsdom` via `@angular/build:unit-test`. Coverage focuses on
the store (initial state, immutability of add / update / delete / reorder,
verdict branches, localStorage round-trip, reset behavior) and a shell
smoke-test that verifies both dashboards and the summary render.
