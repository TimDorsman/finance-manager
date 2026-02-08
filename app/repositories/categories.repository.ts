import type { PostgrestError } from "@supabase/supabase-js";
import type { Database } from "~~/shared/types/database";

export function useCategoryRepository() {
	const supabase = useSupabaseClient<Database>();

	async function insertCategory(
		name: string,
		scope: Scope,
		householdId: string,
	): Promise<PostgrestError | null> {
		const { error } = await supabase
			.from("categories")
			.insert([{ name, scope, household_id: householdId }]);

		if (error) {
			throw error;
		}

		return null;
	}

	async function selectCategories() {
		const { data, error } = await supabase
			.from("categories")
			.select(
				"id,name,scope,ownerUserId:owner_user_id,householdId:household_id,isArchived:is_archived,createdAt:created_at",
			);

		if (error) {
			throw error;
		}
		return data ?? [];
	}

	async function selectCategoryById(id: string) {
		const { data, error } = await supabase
			.from("categories")
			.select(
				"id,name,scope,ownerUserId:owner_user_id,householdId:household_id,isArchived:is_archived,createdAt:created_at",
			)
			.eq("id", id)
			.single();

		if (error) {
			throw error;
		}

		return data;
	}

	async function deleteCategoryById(
		id: string,
	): Promise<PostgrestError | null> {
		const { error } = await supabase
			.from("categories")
			.delete()
			.eq("id", id);
		if (error) {
			throw error;
		}
		return null;
	}

	return {
		insertCategory,
		selectCategories,
		selectCategoryById,
		deleteCategoryById,
	};
}
