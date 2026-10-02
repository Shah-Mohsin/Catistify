# Catistify

Catistify is a local-first companion for multi-pet households. Create cat and dog profiles, discover personality patterns, keep a shared diary, complete daily bonding missions, compare pets, and export backups.

## Local development

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The app works without credentials. Add `GEMINI_API_KEY` to `.env` to enable Gemini-generated insights; heuristic fallbacks remain available when the key is missing.

## Production build

```bash
npm run lint
npm run build
```

The project includes Vercel-compatible API functions under `api/` and a narrowed SPA rewrite in `vercel.json`. Import the project into Vercel with build command `npm run build` and output directory `dist`.

## Data and accounts

Pet records, diary entries, quests, and backups are stored locally in the browser and can be exported as JSON. The account screen is a local device profile, not a hosted identity system. Production multi-device accounts, email delivery, and durable cloud sync require a database/auth provider such as Supabase, Clerk, or Firebase; the included sync endpoint is a deployment-safe demo transport and does not provide durable user isolation.
