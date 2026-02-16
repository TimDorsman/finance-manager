import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import { readBody } from "h3";
import type { CategoryScope } from "~/enums/category-scope";
import { CategoryRepository } from "~~/server/repositories/category.repository";
import { CategoryService } from "~~/server/services/category.service";

export default defineEventHandler(async (event) => {
	const user = await serverSupabaseUser(event);

	if (!user) {
		throw createError({
			statusCode: 401,
			statusMessage: "Unauthorized",
		});
	}

	const body = await readBody<{
		name: string;
		scope: CategoryScope;
		householdId: string;
	}>(event);
	if (!body?.name || !body?.scope || !body?.householdId) {
		throw createError({
			statusCode: 400,
			statusMessage: "Missing required fields",
		});
	}

	const repo = new CategoryRepository(supabase);
	const service = new CategoryService(repo);

	await service.addCategory(
		body.name,
		body.scope as CategoryScope,
		body.householdId,
	);

	return null;
});
