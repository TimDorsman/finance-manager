import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import { CategoryRepository } from "~~/server/repositories/category.repository";
import { CategoryService } from "~~/server/services/category.service";
import { authenticateUser } from "~~/server/utils/authenticateUser";

export default defineEventHandler(async (event) => {
	const user = await authenticateUser(event);
	const supabase = await serverSupabaseClient(event);
	const repo = new CategoryRepository(supabase);
	const service = new CategoryService(repo);

	const cachedGetCategories = defineCachedFunction(
		async () => {
			return service.getCategories();
		},
		{
			maxAge: 30,
			name: "getCategories",
			getKey: () => `all_categories_${user?.sub}`,
		},
	);

	return await cachedGetCategories();
});
