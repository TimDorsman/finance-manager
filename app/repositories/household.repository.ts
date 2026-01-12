import type { Database } from "~/types/supabase";

export function useHouseholdRepository() {
	const user = useSupabaseUser();

	const supabase = useSupabaseClient<Database>();

	async function fetchHousehold() {
		if (!user.value) {
			throw new Error("No user logged in");
		}

		const { data, error } = await supabase
			.from("household_members")
			.select("household:households(id, name), role")
			.eq("user_id", user.value.sub)
			.single();

		if (error) {
			throw error;
		}

		return {
			...data.household,
			role: data.role,
		};
	}

	return { fetchHousehold };
}
