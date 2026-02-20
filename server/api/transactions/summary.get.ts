import { serverSupabaseClient } from "#supabase/server";
import { getQuery } from "h3";
import { TransactionRepository } from "~~/server/repositories/transaction.repository";
import { TransactionService } from "~~/server/services/transaction.service";
import type { AggregationPeriod } from "~~/shared/types/transaction";
import { authenticateUser } from "~~/server/utils/authenticateUser";

export default defineEventHandler(async (event) => {
	await authenticateUser(event);
	const { categoryId, dateFrom, dateTo, period = "month" } = getQuery(event);

	const supabase = await serverSupabaseClient(event);
	const repo = new TransactionRepository(supabase);
	const service = new TransactionService(repo);

	if (
		typeof categoryId !== "string" ||
		typeof dateFrom !== "string" ||
		typeof dateTo !== "string"
	) {
		throw createError({
			statusCode: 400,
			message: "categoryId, dateFrom and dateTo are required",
		});
	}

	const aggregationPeriod: AggregationPeriod =
		period === "day" || period === "year" ? period : "month";

	const cachedGetTransactions = defineCachedFunction(
		async () => {
			return service.getTransactionsSumByPeriod(
				categoryId,
				dateFrom,
				dateTo,
				aggregationPeriod,
			);
		},
		{
			maxAge: 30,
			name: "getTransactions",
			getKey: () =>
				`transactions_${categoryId}_${dateFrom}_${dateTo}_${aggregationPeriod}`,
		},
	);

	return cachedGetTransactions();
});
