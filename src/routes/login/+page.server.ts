import { redirect } from "@sveltejs/kit";

import type { RequestEvent } from "./$types";



/*
Here we're just checking the session and user in event.locals, as made in hooks.server.ts.
If they're filled out, the user is logged in, why are they in the login page? 
	redirect them to /

Strictly speaking, not necessary for the example, but a nice touch of thoroughness.
*/
export async function load(event: RequestEvent) {
	if (event.locals.session !== null && event.locals.user !== null) {
		console.log("/login page.server.ts: event.locals.session and event.locals.user are NOT blank, they don't need to log in, redirect to /.")
		return redirect(302, "/");
	}
	console.log("They reached the /login page. This is step 2 in the README.")
	return {};
}
