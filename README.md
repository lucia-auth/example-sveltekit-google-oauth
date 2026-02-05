# Google OAuth example in SvelteKit

https://developers.google.com/identity/protocols/oauth2

1. You set up client credentials and information with Google (https://console.cloud.google.com/apis). You get keys and specifically set up where to send the token below. They don't want to allow just anyone to pretend to be service X and then mess with google users.
2. You set up a link for the user to click that takes them to google. 
3. They sign in and you get back an access code. 
4. You send the access code to Google and get back a token. 
5. You use the token to Do Stuff With Google (set calender events, whatever).



## Notes

Uses SQLite. Rate limiting is implemented using JavaScript `Map`.

The "Authorized redirect URI" that you set up on console.cloud.google.com/apis MUST be "http://localhost:5173/login/google/callback" or it will fail with a redirect uri mismatch! 


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


