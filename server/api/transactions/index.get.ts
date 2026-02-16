import { serverSupabaseClient } from "#supabase/server";
import { getQuery } from "h3";
import { TransactionRepository } from "~~/server/repositories/transaction.repository";
import { TransactionService } from "~~/server/services/transaction.service";
import { authenticateUser } from "~~/server/utils/authenticateUser";

export default defineEventHandler(async (event) => {
	const user = await authenticateUser(event);
	const { categoryId, month } = getQuery(event);

	const supabase = await serverSupabaseClient(event);
	const repo = new TransactionRepository(supabase);
	const service = new TransactionService(repo);

	const cachedGetTransactions = defineCachedFunction(
		async () => {
			return service.getTransactions({
				categoryId:
					typeof categoryId === "string" ? categoryId : undefined,
				month: typeof month === "string" ? month : undefined,
			});
		},
		{
			maxAge: 30,
			name: "getTransactions",
			getKey: () => `transactions_${user?.sub}_${categoryId}_${month}`,
		},
	);

	return cachedGetTransactions();
});
