import { Google } from "arctic";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "$env/static/private";

export const google = new Google(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, "http://localhost:5173/login/google/callback");
