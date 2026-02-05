import { google } from "$lib/server/oauth";
import { generateCodeVerifier, generateState } from "arctic";

import type { RequestEvent } from "./$types";

export function GET(event: RequestEvent): Response {
	console.log("In /login/google/server.ts. They must have clicked the login link on the /login page. This is now getting everything ready to send to google and redirecting there.");
	//generateState from arctic makes a string of cryptographically strong random values.
	const state = generateState();					
	//generateCodeVerifier from arctic makes a string of cryptographically strong random values.
	const codeVerifier = generateCodeVerifier();

	/*	
	Uses the createAuthorizationURL function of the google object to return the URL
	Where/How is this used?
	Console log url! It's redirected below to google. 
		It includes the "Authorized redirect URI" that MUST match what you put in the goole api console setup. 
	*/
	const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "profile", "email"]);

	//Setting cookies that are looked at in /login/google/callback/server.ts
	event.cookies.set("google_oauth_state", state, {
		httpOnly: true,
		maxAge: 60 * 10,
		secure: import.meta.env.PROD,
		path: "/",
		sameSite: "lax"
	});
	event.cookies.set("google_code_verifier", codeVerifier, {
		httpOnly: true,
		maxAge: 60 * 10,
		secure: import.meta.env.PROD,
		path: "/",
		sameSite: "lax"
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString()
		}
	});
}
