# Google OAuth example in SvelteKit

Uses SQLite. Rate limiting is implemented using JavaScript `Map`.

## Initialize project

Register an OAuth client on the Google API Console. Paste the client ID and secret to a `.env` file.

```bash
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET="
```

Create `sqlite.db` and run `setup.sql`.

```
sqlite3 sqlite.db
```

Run the application:

```
pnpm dev
```
