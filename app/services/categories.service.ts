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

	async function getCategories(): Promise<
		{
			id: string;
			name: string;
			scope: string;
			ownerUserId: string | null;
			isArchived: boolean;
			householdId: string;
			createdAt: Date;
			isPersonal: boolean;
		}[]
	> {
		const categories = await selectCategories();

		return categories.map((category) => ({
			id: category.id,
			name: category.name,
			scope: category.scope,
			ownerUserId: category.owner_user_id,
			isArchived: category.is_archived ?? false,
			householdId: category.household_id,
			createdAt: new Date(category.created_at!),
			isPersonal: category.scope === "personal",
		}));
	}

	return {
		addCategory,
		getCategories,
	};
}
