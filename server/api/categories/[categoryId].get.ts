import { serverSupabaseClient } from "#supabase/server";
import { getRouterParam } from "h3";
import { CategoryRepository } from "~~/server/repositories/category.repository";
import { CategoryService } from "~~/server/services/category.service";
import { authenticateUser } from "~~/server/utils/authenticateUser";

export default defineCachedEventHandler(
	async (event) => {
		await authenticateUser(event);
		const categoryId = getRouterParam(event, "categoryId");

		if (!categoryId) {
			throw createError({
				statusCode: 400,
				statusMessage: "Category id is required",
			});
		}

		const supabase = await serverSupabaseClient(event);

		const repo = new CategoryRepository(supabase);
		const service = new CategoryService(repo);

		return service.getCategoryById(categoryId);
	},
	{
		maxAge: 3600,
	},
);
