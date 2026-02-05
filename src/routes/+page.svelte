<!--
This is displaying basic information about the user, gleaned from the information returned from Google. 
We need to get the user.name, user.picture, user.email into data.
	That is done in page.server.ts 

Note the form with the POST for sign out. That is handled by the default action in page.server.ts.

Although this is the "Default" page, we do NOT see this if we're not logged in. 
The hooks.Server.ts handle checks will redirect to /login if we're not logged in first.
-->


<script lang="ts">
	import { enhance } from "$app/forms";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<h1>Hi, {data.user.name}!</h1>
<img src={data.user.picture} height="100px" width="100px" alt="profile" />
<p>Email: {data.user.email}</p>
<form method="post" use:enhance>
	<button>Sign out</button>
</form>
