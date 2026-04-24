# Plus / Minus

A single-page decision helper. Enter a topic (e.g. _"new job"_), log pluses and
minuses in two columns, and see a live verdict based on counts. State persists
to `localStorage` and survives reloads; a Reset button clears everything.

Features:

- Add, inline-edit, delete, and drag-reorder items
- Live count comparison with verdict badge
- Fully client-side — no backend
- Server-side rendered via `@angular/ssr`
- Responsive two-column layout (stacks on mobile)

## Stack

Angular 21 (standalone components, signals, zoneless-ready) · TypeScript strict
mode · Tailwind CSS v4 · `@angular/cdk` drag-drop · Express SSR · Vitest · ESLint
(flat config, `angular-eslint`) · Prettier (with `prettier-plugin-tailwindcss`).

## Scripts

```bash
pnpm start          # dev server at http://localhost:4200
pnpm build          # production build (browser + SSR bundles → dist/)
pnpm test           # run unit tests (Vitest via ng test)
pnpm lint           # run ESLint across .ts and .html
pnpm format         # format all files with Prettier
pnpm format:check   # verify formatting without writing changes
pnpm serve:ssr:plusminus  # run the built SSR server
```

## Project structure

```
src/app/
├── app.ts / app.html           # shell: topic input, reset, layout
└── decision/
    ├── decision.types.ts       # DecisionItem, Kind, DecisionState
    ├── decision-store.ts       # signal store + localStorage persistence
    ├── decision-store.spec.ts  # unit tests for the store
    ├── dashboard.ts / .html    # one column (plus or minus)
    ├── item-form.ts / .html    # add-item input
    ├── item-card.ts / .html    # single row (drag, edit, delete)
    └── summary.ts / .html      # counts + verdict badge
```

State lives in `DecisionStore`, an injectable signal-based store. Writes to
`localStorage['plus-minus:v1']` through an `effect()` guarded with
`isPlatformBrowser` so SSR stays clean.
