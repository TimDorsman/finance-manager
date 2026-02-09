import type { Database } from "~~/shared/types/database";

export function useHouseholdRepository() {
	const supabase = useSupabaseClient<Database>();

	async function fetchHousehold() {
		const { data, error } = await supabase
			.from("household_members")
			.select("household:households(id, name), role")
			.single();

		if (error) {
			return null;
		}

		if (!data?.household) {
			return null;
		}

		return {
			...data.household,
			role: data.role,
		};
	}

	return { fetchHousehold };
}
