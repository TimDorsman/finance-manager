export function useCategoryService() {
	const { create } = useCategoryRepository();

	function createCategory(name: string, scope: string, householdId: string) {
		create(name, scope, householdId);
	}

	return {
		createCategory,
	};
}
