import { redirect } from "@sveltejs/kit";

import type { RequestEvent } from "./$types";



/*
Here we're just checking the session and user in event.locals, as made in hooks.server.ts.
If they're filled out, the user is logged in, why are they in the login page? 
	redirect them to /
*/
export async function load(event: RequestEvent) {
	if (event.locals.session !== null && event.locals.user !== null) {
		return redirect(302, "/");
	}
	return {};
}
