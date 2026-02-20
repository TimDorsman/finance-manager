import { serverSupabaseClient } from "#supabase/server";
import { getQuery } from "h3";
import { TransactionRepository } from "~~/server/repositories/transaction.repository";
import { TransactionService } from "~~/server/services/transaction.service";
import { authenticateUser } from "~~/server/utils/authenticateUser";

export default defineEventHandler(async (event) => {
	const user = await authenticateUser(event);
	const { categoryId, dateFrom, dateTo } = getQuery(event);

	const supabase = await serverSupabaseClient(event);
	const repo = new TransactionRepository(supabase);
	const service = new TransactionService(repo);

	const cachedGetTransactions = defineCachedFunction(
		async () => {
			return service.getTransactions({
				categoryId:
					typeof categoryId === "string" ? categoryId : undefined,
				dateFrom: typeof dateFrom === "string" ? dateFrom : undefined,
				dateTo: typeof dateTo === "string" ? dateTo : undefined,
			});
		},
		{
			maxAge: 30,
			name: "getTransactions",
			getKey: () => `transactions_${categoryId}_${dateFrom}_${dateTo}`,
		},
	);

	return cachedGetTransactions();
});
