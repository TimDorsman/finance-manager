# Repository Guidelines

## Project Structure & Module Organization

This is a Nuxt 4 + TypeScript app with separated client, server, and shared code:

- `app/`: UI and client logic (`pages/`, `components/`, `features/`, `services/`, `repositories/`, `composables/`, `assets/css/`).
- `server/`: API handlers and backend layers (`api/`, `services/`, `repositories/`, `utils/`).
- `shared/`: cross-runtime types and utility helpers (`shared/types`, `shared/utils`).
- `public/`: static assets (images, favicon, robots).
- Root config: `nuxt.config.ts`, `tsconfig.json`, `package.json`.

Keep feature-specific UI in `app/features/<feature>/components` and shared UI in `app/components`.

## Build, Test, and Development Commands

- `npm run dev`: start local dev server at `http://localhost:3000`.
- `npm run devServer`: start Nuxt on `0.0.0.0:3333` for LAN/device testing.
- `npm run build`: create production build.
- `npm run preview`: serve the production build locally.
- `npm run generate`: generate static output.
- `npx nuxi typecheck`: run TypeScript checks explicitly.

## Coding Style & Naming Conventions

- Use TypeScript across client and server layers.
- Follow existing formatting style: tabs for indentation, trailing commas, double quotes.
- Vue components: `PascalCase.vue` (example: `AppHeader.vue`).
- Composables: `useXxx.ts` (example: `useActiveHousehold.ts`).
- Server APIs follow Nuxt file routing: `index.get.ts`, `[id].delete.ts`, etc.
- Keep service/repository naming explicit (`transaction.service.ts`, `transaction.repository.ts`).
- Support both dark and light mode when color changes are asked

## Testing Guidelines

There is currently no committed automated test suite (`test` script is not defined). For now:

- Run `npx nuxi typecheck` before opening a PR.
- Run `npm run build` to catch integration/runtime issues.
- Manually verify changed flows in the app and related API endpoints.
- If adding tests, prefer colocated `*.spec.ts` files and document the command in `package.json`.

## Commit & Pull Request Guidelines

Recent history favors short, imperative commit subjects (for example: `Add more skeleton components`).

- Write focused commits with present-tense, imperative subjects.
- Keep each commit scoped to one logical change.
- PRs should include:
    - clear summary of behavior changes,
    - linked issue/ticket when available,
    - screenshots or short recordings for UI updates,
    - notes on environment/config updates.

## Security & Configuration Tips

- Keep Supabase credentials in `.env` (`SUPABASE_URL`, `SUPABASE_KEY`); never hardcode secrets.
- When updating database types, regenerate `shared/types/database.ts` from Supabase and include it in the same PR.
- To update the `shared/types/database.ts` file. You run: `npx supabase gen types typescript --project-id yjnpzaishmakkgevabgv --schema public > shared/types/database.ts`. Only do it when necessary
