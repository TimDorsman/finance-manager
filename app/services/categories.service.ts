import type { PostgrestError } from "@supabase/supabase-js";

const CACHE_TTL = 60_000; // 1 minute

const supplyCacheKeys = {
	getCategories: () => "categories:all",
	getCategoryById: (id: string) => `categories:by-id:${id}`,
};

export function useCategoryService() {
	const { insertCategory, selectCategories, selectCategoryById } =
		useCategoryRepository();

	function getCategoryById(id: string) {
		const cacheKey = supplyCacheKeys.getCategoryById(id);
		const { fetchedAt } = useCache(cacheKey, CACHE_TTL);

		return useAsyncData<Category | null>(
			cacheKey,
			async () => {
				const data = await selectCategoryById(id);
				if (!data) return null;

				fetchedAt.value = Date.now();

				return {
					...data,
					createdAt: new Date(data.createdAt),
				};
			},
			{
				default: () => null,
				getCachedData(key, nuxtApp) {
					if (!fetchedAt.value) return;
					if (Date.now() - fetchedAt.value > CACHE_TTL) return;
					return nuxtApp.payload.data[key];
				},
			},
		);
	}

	function getCategories() {
		const cacheKey = supplyCacheKeys.getCategories();
		const { fetchedAt } = useCache(cacheKey, CACHE_TTL);

		return useAsyncData<CategoryView[]>(
			cacheKey,
			async () => {
				const categories = await selectCategories();

				fetchedAt.value = Date.now();

				return categories.map((category) => ({
					...category,
					createdAt: new Date(category.createdAt),
					isPersonal: category.scope === "personal",
				}));
			},
			{
				default: () => [],
				getCachedData(key, nuxtApp) {
					if (!fetchedAt.value) return;
					if (Date.now() - fetchedAt.value > CACHE_TTL) return;
					return nuxtApp.payload.data[key];
				},
			},
		);
	}

	async function addCategory(
		name: string,
		scope: Scope,
		householdId: string,
	): Promise<PostgrestError | null> {
		const error = await insertCategory(name, scope, householdId);

		if (!error) {
			useCache(supplyCacheKeys.getCategories(), CACHE_TTL).invalidate();
		}

		return error;
	}

	async function deleteCategory(id: string): Promise<PostgrestError | null> {
		const { deleteCategoryById } = useCategoryRepository();
		const error = await deleteCategoryById(id);

		if (!error) {
			// Invalidate caches
			const cacheKeysToInvalidate = [
				supplyCacheKeys.getCategories(),
				supplyCacheKeys.getCategoryById(id),
			];
			cacheKeysToInvalidate.forEach((key) =>
				useCache(key, CACHE_TTL).invalidate(),
			);
		}

		return error;
	}

	return {
		addCategory,
		getCategories,
		getCategoryById,
		deleteCategory,
	};
}
