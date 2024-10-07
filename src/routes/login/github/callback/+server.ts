import { google } from "$lib/server/oauth";
import { ObjectParser } from "@pilcrowjs/object-parser";
import { createUser, getUserFromGoogleId } from "$lib/server/user";
import { createSession, generateSessionToken, setSessionTokenCookie } from "$lib/server/session";
import { decodeIdToken } from "arctic";

import type { RequestEvent } from "./$types";
import type { OAuth2Tokens } from "arctic";

export async function GET(event: RequestEvent): Promise<Response> {
	const storedState = event.cookies.get("google_oauth_state") ?? null;
	const codeVerifier = event.cookies.get("google_code_verifier") ?? null;
	const code = event.url.searchParams.get("code");
	const state = event.url.searchParams.get("state");

	if (storedState === null || codeVerifier === null || code === null || state === null) {
		return new Response("Please restart the process.", {
			status: 400
		});
	}
	if (storedState !== state) {
		return new Response("Please restart the process.", {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch (e) {
		return new Response("Please restart the process.", {
			status: 400
		});
	}

	const claims = decodeIdToken(tokens.idToken());
	const claimsParser = new ObjectParser(claims);

	const googleId = claimsParser.getString("sub");
	const name = claimsParser.getString("name");
	const picture = claimsParser.getString("picture");
	const email = claimsParser.getString("email");

	const existingUser = getUserFromGoogleId(googleId);
	if (existingUser !== null) {
		const sessionToken = generateSessionToken();
		const session = createSession(sessionToken, existingUser.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/"
			}
		});
	}

	const user = createUser(googleId, email, name, picture);
	const sessionToken = generateSessionToken();
	const session = createSession(sessionToken, user.id);
	setSessionTokenCookie(event, sessionToken, session.expiresAt);
	return new Response(null, {
		status: 302,
		headers: {
			Location: "/"
		}
	});
}
