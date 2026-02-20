import { serverSupabaseClient } from "#supabase/server";
import { getRouterParam, defineEventHandler, createError } from "h3";
import { CategoryRepository } from "~~/server/repositories/category.repository";
import { CategoryService } from "~~/server/services/category.service";
import { authenticateUser } from "~~/server/utils/authenticateUser";

export default defineEventHandler(async (event) => {
	try {
		const user = await authenticateUser(event);
		const categoryId = getRouterParam(event, "categoryId");

		if (!categoryId) {
			throw createError({
				statusCode: 400,
				message: "Category id is required",
			});
		}

		const supabase = await serverSupabaseClient(event);
		const repo = new CategoryRepository(supabase);
		const service = new CategoryService(repo);

		const cachedGetCategory = defineCachedFunction(
			async (id: string) => {
				const category = await service.getCategoryById(id);
				if (!category) {
					throw createError({
						statusCode: 404,
						message: "Category not found",
					});
				}
				return category;
			},
			{
				maxAge: 3600,
				name: "getCategoryById",
				getKey: (id: string) => `category_${user?.sub}_${id}`,
			},
		);

		return await cachedGetCategory(categoryId);
	} catch (error: any) {
		if (error.statusCode) throw error;

		console.error("Category API Error:", error);
		throw createError({
			statusCode: 500,
			message: "Internal Server Error while fetching category",
		});
	}
});
