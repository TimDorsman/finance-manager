import { serverSupabaseClient } from "#supabase/server";
import { TransactionRepository } from "~/server/repositories/transaction.repository";
import { TransactionService } from "~/server/services/transaction.service";
import { getQuery } from "h3";

export default cachedEventHandler(
	async (event) => {
		const { categoryId, month } = getQuery(event);

		const supabase = await serverSupabaseClient(event);
		const repo = new TransactionRepository(supabase);
		const service = new TransactionService(repo);

		return service.getTransactions({
			categoryId: typeof categoryId === "string" ? categoryId : undefined,
			month: typeof month === "string" ? month : undefined,
		});
	},
	{
		maxAge: 60,
	},
);
