/*
In Svelte, all requests go through the hook function. 
This is a good place to do auth checks. 
	Otherwise, you'd have to do them individually in all the blah.server functions, and that's not DRY. 
*/




import { TokenBucket } from "$lib/server/rate-limit";
import { validateSessionToken, setSessionTokenCookie, deleteSessionTokenCookie } from "$lib/server/session";
import { sequence } from "@sveltejs/kit/hooks";

import type { Handle } from "@sveltejs/kit";

const bucket = new TokenBucket<string>(100, 1);

const rateLimitHandle: Handle = async ({ event, resolve }) => {
	// Note: Assumes X-Forwarded-For will always be defined.
	const clientIP = event.request.headers.get("X-Forwarded-For");
	if (clientIP === null) {
		return resolve(event);
	}
	let cost: number;
	if (event.request.method === "GET" || event.request.method === "OPTIONS") {
		cost = 1;
	} else {
		cost = 3;
	}
	if (!bucket.consume(clientIP, cost)) {
		return new Response("Too many requests", {
			status: 429
		});
	}
	return resolve(event);
};

/*
We are checking the cookies for a session and loading up event.locals.user and event.locals.session with user information. 
Where will that user information get read and used? 
*/
const authHandle: Handle = async ({ event, resolve }) => {
	//Get the cookie if it exists, else is null, event.locals is empty, resolve and done. 
	const token = event.cookies.get("session") ?? null;
	if (token === null) {
		event.locals.user = null;
		event.locals.session = null;
		console.log("hooks.server.ts: No session cookie, events.locals.user and session set to null.");
		return resolve(event);
	}

	/*Assuming the session cookie existed, we need to make sure the session is good. Check it.
	If it's good, set/reset the session token cookie, if it's bad, delete it
	*/
	const { session, user } = validateSessionToken(token);
	if (session !== null) {
		setSessionTokenCookie(event, token, session.expiresAt);
		console.log("hooks.server.ts: There was a session cookie and the token in it was good in the DB. We created a session cookie.");

	} else {
		deleteSessionTokenCookie(event);
		console.log("hooks.server.ts: There was a session cookie and the token in it was bad in the DB. We deleted the session cookie.");

	}

	//set event.locals information to be used later. 
	event.locals.session = session;
	event.locals.user = user;
	console.log("hooks.server.ts: We set event.locals.session and event.locals.user.");

	return resolve(event);
};


/*
Note the sequence(), that's just a helper function that calls different handle functions in a middleware like manner. 
So it's doing the rate limit check first, then the auth check. 
*/
export const handle = sequence(rateLimitHandle, authHandle);
