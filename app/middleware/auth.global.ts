// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
	const session = useSupabaseSession();

	// If we're on the auth page and already have a session, go home
	if (to.path === "/auth") {
		if (session.value) {
			return navigateTo("/");
		}
		return;
	}

	// If no session exists and we're not on the auth page, go to auth
	if (!session.value) {
		return navigateTo("/auth");
	}
});
