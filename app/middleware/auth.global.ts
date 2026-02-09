// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
	if (import.meta.server) {
		return;
	}

	const supabase = useSupabaseClient();
	const session = useSupabaseSession();

	if (import.meta.client && session.value === null) {
		await supabase.auth.getSession();
	}

	if (to.path === "/auth") {
		if (session.value) {
			return navigateTo("/");
		}
		return;
	}

	if (!session.value) {
		return navigateTo("/auth");
	}
});
