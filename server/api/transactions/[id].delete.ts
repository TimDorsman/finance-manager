import { serverSupabaseClient } from "#supabase/server";
import { TransactionRepository } from "~~/server/repositories/transaction.repository";
import { TransactionService } from "~~/server/services/transaction.service";
import { authenticateUser } from "~~/server/utils/authenticateUser";

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");
	await authenticateUser(event);

	if (!id) {
		throw createError({
			statusCode: 400,
			statusMessage: "Transaction id is required",
		});
	}

	const supabase = await serverSupabaseClient(event);
	const repo = new TransactionRepository(supabase);
	const service = new TransactionService(repo);
	await service.deleteTransaction(id);

	return null;
});
