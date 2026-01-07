export default defineNuxtRouteMiddleware((to) => {
	const session = useSupabaseSession();

	// Guest-only page
	if (to.path === "/auth") {
		if (session.value) {
			return navigateTo("/");
		}
		return;
	}

	// Everything else is auth-only
	if (!session.value) {
		return navigateTo("/auth");
	}
});
