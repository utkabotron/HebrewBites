# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Dual-Repo Setup

This project consists of two independent git repositories:

| Repo | Path | Remote |
|------|------|--------|
| **App** (код) | `/Users/pavelbrick/Projects/09_HebrewBites/` | `utkabotron/HebrewBites` |
| **Docs** (документация) | `/Users/pavelbrick/Projects/09_HebrewBites/TAL/` | `talmannn/hebrebites-mobile-app` |

`TAL/` is in the app repo's `.gitignore` — they are fully independent.

### Git operations — ALWAYS both repos

When asked to **commit**, **push**, or **pull** — do it for BOTH repos:

- **commit**: stage and commit in each repo separately (only if there are changes in that repo)
- **push**: `git push` in both repos
- **pull**: `git pull` in both repos

Always run the operation in the App repo first, then in the Docs repo.

## Development Commands

- `npx expo start` — start Expo dev server
- `npx expo start --ios` — run on iOS simulator
- `npx expo start --android` — run on Android emulator
- `npx expo start --web` — run in browser

No test runner or linter is configured yet.

## Architecture

HebrewBites is a Hebrew language learning flashcard app built with **Expo SDK 52**, **expo-router v4** (file-based routing), and **React Native Reanimated**.

### Routing Structure

- `app/_layout.tsx` — Root Stack navigator. Hides headers globally, sets warm background (`#FDF6EE`).
- `app/(tabs)/` — Bottom tab navigator (Home, Catalog, Saved, Profile). Uses a **floating glass tab bar** (absolute positioned, rounded, with `expo-blur` on iOS).
- `app/set/[id].tsx` — Set detail screen (card presentation). Shows learning mode selector (Sequential/Random/Adaptive/Review) and navigates to learn screen.
- `app/learn/[setId].tsx` — Flashcard learning session (fullScreenModal, slides from bottom). Uses Reanimated for card flip animation. Shows session-complete summary when all cards are done.

### Visual Design System

All colors and reusable glass-morphism styles live in `constants/Colors.ts`:
- `Colors` — flat color tokens including semantic groups (`glass.*`, `badge.*`, `tabBar.*`)
- `GlassStyle.card` / `GlassStyle.cardStrong` — pre-built glass card styles (semi-transparent white bg, white border, soft shadow, 20px radius)

The app uses a warm palette (primary `#C4712B`, background `#FDF6EE`) with decorative semi-transparent background circles on every screen.

### Key Patterns

- **Path alias**: `@/*` maps to project root (configured in `tsconfig.json`)
- **No state management or backend yet** — all data (card sets, cards, stats) is hardcoded inline in screen components
- **Icons**: `@expo/vector-icons` Ionicons throughout, with filled/outline variants for active/inactive states
- **Typed routes** enabled via `experiments.typedRoutes` in `app.json`
