import type { PostgrestError } from "@supabase/supabase-js";

export function useCategoryService() {
	const { insertCategory, selectCategories, selectCategoryById } =
		useCategoryRepository();

	async function getCategoryById(id: string): Promise<Category> {
		const category = await selectCategoryById(id);
		return {
			...category,
			createdAt: new Date(category.createdAt),
		};
	}

	async function getCategories(): Promise<CategoryView[]> {
		const categories = await selectCategories();

		return categories.map(
			(category): CategoryView => ({
				...category,
				createdAt: new Date(category.createdAt),
				isPersonal: category.scope === "personal",
			}),
		);
	}

	function addCategory(
		name: string,
		scope: Scope,
		householdId: string,
	): Promise<PostgrestError | null> {
		return insertCategory(name, scope, householdId);
	}

	async function deleteCategory(id: string): Promise<PostgrestError | null> {
		const { deleteCategoryById } = useCategoryRepository();
		return await deleteCategoryById(id);
	}

	return {
		addCategory,
		getCategories,
		getCategoryById,
		deleteCategory,
	};
}
