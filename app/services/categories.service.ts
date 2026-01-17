import type { PostgrestError } from "@supabase/supabase-js";

export function useCategoryService() {
	const { insertCategory, selectCategories } = useCategoryRepository();

	function addCategory(
		name: string,
		scope: Scope,
		householdId: string
	): Promise<PostgrestError | null> {
		return insertCategory(name, scope, householdId);
	}

	function getCategories() {
		return selectCategories();
	}

	return {
		addCategory,
		getCategories,
	};
}
