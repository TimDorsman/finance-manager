import { serverSupabaseClient } from "#supabase/server";
import { CategoryRepository } from "~~/server/repositories/category.repository";
import { CategoryService } from "~~/server/services/category.service";

export default defineEventHandler(async (event) => {
	// 1. Initialize Supabase normally for every request to ensure Auth context is fresh
	const supabase = await serverSupabaseClient(event);
	const repo = new CategoryRepository(supabase);
	const service = new CategoryService(repo);

	// 2. Create a cached version of the fetcher function
	const cachedGetCategories = defineCachedFunction(
		async () => {
			return service.getCategories();
		},
		{
			maxAge: 5,
			name: "getCategories",
			getKey: () => "all_categories", // Static key since categories are likely public/global
		},
	);

	return await cachedGetCategories();
});
