import { dev } from "$app/environment";
import { google } from "$lib/server/oauth";
import { redirect } from "@sveltejs/kit";
import { generateCodeVerifier, generateState } from "arctic";

import type { RequestEvent } from "./$types";

export function GET(event: RequestEvent): Response {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "profile", "email"]);

	event.cookies.set("google_oauth_state", state, {
		maxAge: 60 * 10,
		secure: !dev || event.url.protocol === "https",
		path: "/"
	});
	event.cookies.set("google_code_verifier", codeVerifier, {
		maxAge: 60 * 10,
		secure: !dev || event.url.protocol === "https",
		path: "/"
	});

	redirect(307, url.toString());
}
