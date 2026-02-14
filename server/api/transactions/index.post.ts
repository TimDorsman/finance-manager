import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import { TransactionRepository } from "~~/server/repositories/transaction.repository";
import { TransactionService } from "~~/server/services/transaction.service";

export default defineEventHandler(async (event) => {
	const user = await serverSupabaseUser(event);

	if (!user) {
		throw createError({
			statusCode: 401,
			statusMessage: "Unauthorized",
		});
	}

	const body = await readBody<{
		amount: number;
		categoryId: string;
		date: string;
		description: string;
		householdId: string;
		userId: string;
	}>(event);
	if (
		!body.amount ||
		!body.categoryId ||
		!body.date ||
		!body.description ||
		!body.householdId ||
		!body.userId
	) {
		throw createError({
			statusCode: 400,
			statusMessage: "Missing required fields",
		});
	}

	const supabase = await serverSupabaseClient(event);
	const repo = new TransactionRepository(supabase);
	const service = new TransactionService(repo);
	await service.addTransaction(body);

	return null;
});
