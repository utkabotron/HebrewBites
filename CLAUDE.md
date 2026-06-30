# CLAUDE.md

> ⚠️ **ARCHIVED — concept prototype, not the product.** This root app is no longer
> developed. The active product is **`TAL/mobile-app`** (`talmannn/hebrebites-mobile-app`,
> Expo SDK 56). Do not add features here. See `ARCHIVED.md`.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## RULES

- Git ops (commit/push/pull) — run in **App repo first, then TAL repo**, only if that repo has changes. Treat them as fully independent (separate remotes, separate history).
- `TAL/` is gitignored in App; has its own `.git`, its own `CLAUDE.md`, and its own `.claude/`. Never `cd TAL && git ...` from the App context without scoping.
- Never `git add -A` from repo root — sensitive/large files live alongside code (`Договор HebrewBites.pdf`, `*.pdf`, `design/` mockups). Stage by explicit path.
- No test runner, no linter, no formatter configured. Do not invent `npm test` / `npm run lint` commands.
- Production builds: not set up. Don't run `eas build` / `expo prebuild` without explicit ask.
- Landing site is a **separate repo** at `/Users/pavelbrick/Projects/09_HebrewBites_landing` — use the `hebrewbites-landing-deploy` skill, do not touch from here.
- Hardcoded UI data only — no backend, no state manager, no persistence layer yet. Don't introduce one without an ask.

## REPOS

| Repo | Path | Remote | Purpose |
|---|---|---|---|
| App | `/Users/pavelbrick/Projects/09_HebrewBites/` | `utkabotron/HebrewBites` | RN/Expo source |
| Docs | `/Users/pavelbrick/Projects/09_HebrewBites/TAL/` | `talmannn/hebrebites-mobile-app` | Dictionary + product docs (separate owner) |
| Landing | `/Users/pavelbrick/Projects/09_HebrewBites_landing/` | `utkabotron/hebrewbites-landing` | Next.js marketing site (NOT in this tree) |

## STACK

| Layer | Version | Notes |
|---|---|---|
| Expo SDK | 52 | `expo` `~52.0.0` |
| Router | expo-router ~4 | File-based; `experiments.typedRoutes: true` |
| React Native | 0.76.9 | New Architecture default in SDK 52 |
| React | 18.3.1 | — |
| Animations | react-native-reanimated ~3.16 | Card flip on learn screen |
| Blur | expo-blur ~14 | iOS glass tab bar |
| TS | ~5.3 strict | Path alias `@/*` → repo root |
| Icons | `@expo/vector-icons` Ionicons | Filled = active, outline = inactive |

## COMMANDS

| Action | Command |
|---|---|
| Dev server | `npx expo start` (or `npm start`) |
| iOS sim | `npx expo start --ios` |
| Android | `npx expo start --android` |
| Web | `npx expo start --web` |

## KEY FILES

| Path | Purpose |
|---|---|
| `app/_layout.tsx` | Root Stack; hides headers; background `#FDF6EE` |
| `app/(tabs)/_layout.tsx` | Bottom tabs (floating glass bar, abs-positioned, rounded, `expo-blur` on iOS) |
| `app/(tabs)/index.tsx` | Home |
| `app/(tabs)/catalog.tsx` | Catalog of sets |
| `app/(tabs)/saved.tsx` | Saved items |
| `app/(tabs)/profile.tsx` | Profile / stats |
| `app/set/[id].tsx` | Set detail; mode selector (Sequential/Random/Adaptive/Review) → navigates to learn |
| `app/learn/[setId].tsx` | Flashcard session; `presentation: fullScreenModal` (slides up); Reanimated flip; session-complete summary |
| `constants/Colors.ts` | `Colors` tokens (incl. `glass.*`, `badge.*`, `tabBar.*`) + `GlassStyle.card` / `GlassStyle.cardStrong` |
| `components/ExternalLink.tsx` | Only shared component currently |
| `app.json` | Expo config; bundle id `com.hebrewbites.app`; warm splash bg `#FDF6EE` |
| `tsconfig.json` | Strict; extends `expo/tsconfig.base`; `@/*` alias |
| `design/` | PNG/PDF mockups — design source of truth, not code |
| `docs/` | Product docs (App-side, distinct from `TAL/docs/`) |
| `TAL/` | Separate repo: dictionary, content, partner docs |

## ROUTING

```
app/
├─ _layout.tsx              Stack (headerShown:false, bg #FDF6EE)
├─ (tabs)/                  Tab group — floating glass bar
│  ├─ _layout.tsx
│  ├─ index.tsx             Home
│  ├─ catalog.tsx
│  ├─ saved.tsx
│  └─ profile.tsx
├─ set/[id].tsx             Mode picker → push /learn/[setId]
└─ learn/[setId].tsx        fullScreenModal (slide-from-bottom)
```

## DESIGN TOKENS

- Primary: `#C4712B` (warm terracotta)
- Background: `#FDF6EE` (warm cream)
- Glass cards: semi-transparent white bg + white border + soft shadow, radius 20
- Decorative semi-transparent circles on every screen as background motif
- All tokens flow through `constants/Colors.ts` — do NOT hardcode colors in screens

## CONSTRAINTS

- No backend, no API client, no auth — card sets, cards, and stats are inline literals in screen components
- No global state — use local `useState` / `useReducer`; lift to context only with explicit ask
- iOS-first visual language (glass blur); Android falls back to opaque tab bar — verify on both when changing tab UI
- Typed routes are on — new routes need a build to refresh `.expo/types`
- `expo-router` v4 link/`router.push` API; do not import from `@react-navigation/native` directly for navigation
- Web is supported but not the primary target — don't break native to fix web
- Author email for all commits: `pavelbrick@gmail.com` (set globally; do not override per-repo)
