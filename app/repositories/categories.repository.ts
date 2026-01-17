import type { PostgrestError } from "@supabase/supabase-js";
import type { Database } from "~~/shared/types/database";

export function useCategoryRepository() {
	const supabase = useSupabaseClient<Database>();

	async function insertCategory(
		name: string,
		scope: Scope,
		householdId: string
	): Promise<PostgrestError | null> {
		const { error } = await supabase
			.from("categories")
			.insert([{ name, scope, household_id: householdId }]);

		return error;
	}

	async function selectCategories(): Promise<
		{
			id: string;
			name: string;
			scope: string;
			owner_user_id: string | null;
			household_id: string;
			is_archived: boolean | null;
			created_at: string | null;
		}[]
	> {
		const { data, error } = await supabase
			.from("categories")
			.select(
				"id, name, scope, owner_user_id, household_id, is_archived, created_at"
			);

		if (error) throw error;
		return data ?? [];
	}

	return {
		insertCategory,
		selectCategories,
	};
}
