

import { fail, redirect } from "@sveltejs/kit";
import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/session";

import type { Actions, RequestEvent } from "./$types";


/*
This look at event.locals.session, which was created in hooks.server.ts
If they don't have a session, it redirects them to the /login route. 
This could have also been done in the hooks.server.ts?
	In a small app like this, it's fine to put it here. 
	In a larger app that needs protected routes, this sort of thing would have been done in the hooks.server.ts.
	It's a pain to protect multiple routes in each individual route, the same way. Not DRY. 
*/
export async function load(event: RequestEvent) {
	//if no user OR session, redirect to login. 
	if (event.locals.session === null || event.locals.user === null) {
		console.log("page.server.ts: they went to the main page, but aren't logged in, redirecting to /login.");
		return redirect(302, "/login");
	}
	//if there IS a user, return the user (an object containing name, email, picture) to the page data for display there.
	console.log("page.server.ts: They went to the main page, they ARE logged in, return user information for display on the page.");
	return {
		user: event.locals.user
	};
}



/*
These are the actual actions that respond to POST from a form. 
There's only one, and it's the default action. 
In a bigger page with more forms, you might have multiple named actions. 
*/
export const actions: Actions = {
	default: action
};




/*
If there's no session (Or it's old I suppose), return an error 401 (a request to a server failed because it lacks valid authentication credentials)
invalidate the session and delete the cookie
then redirect to /login
*/
async function action(event: RequestEvent) {
	if (event.locals.session === null) {
		return fail(401);
	}
	invalidateSession(event.locals.session.id);
	deleteSessionTokenCookie(event);
	return redirect(302, "/login");
}
