import type { Database } from "~/types/supabase";

export function useCategoryRepository() {
	const supabase = useSupabaseClient<Database>();

	const create = async (
		name: string,
		scope: string,
		householdId: string
	): Promise<void> => {
		const { error } = await supabase
			.from("categories")
			.insert([{ name, scope, household_id: householdId }]);
	};

	return {
		create,
	};
}
