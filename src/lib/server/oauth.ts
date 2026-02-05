import { Google } from "arctic";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "$env/static/private";

/*  
    This makes a new "google" object that holds all the relevant information for us. 
    https://github.com/pilcrowonpaper/arctic/blob/main/src/providers/google.ts
*/
export const google = new Google(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, "http://localhost:5173/login/google/callback");
