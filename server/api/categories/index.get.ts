import { serverSupabaseClient } from "#supabase/server";
import { CategoryRepository } from "~~/server/repositories/category.repository";
import { CategoryService } from "~~/server/services/category.service";

export default defineEventHandler(async (event) => {
	const supabase = await serverSupabaseClient(event);

	const repo = new CategoryRepository(supabase);
	const service = new CategoryService(repo);

	return service.getCategories();
});
