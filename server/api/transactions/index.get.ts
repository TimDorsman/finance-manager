import { serverSupabaseClient } from "#supabase/server";
import { getQuery } from "h3";
import { TransactionRepository } from "~~/server/repositories/transaction.repository";
import { TransactionService } from "~~/server/services/transaction.service";

export default defineEventHandler(async (event) => {
	const { categoryId, month } = getQuery(event);

	const supabase = await serverSupabaseClient(event);
	const repo = new TransactionRepository(supabase);
	const service = new TransactionService(repo);

	return service.getTransactions({
		categoryId: typeof categoryId === "string" ? categoryId : undefined,
		month: typeof month === "string" ? month : undefined,
	});
});
