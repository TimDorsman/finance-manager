import type { Database } from "~~/shared/types/database";

type TransactionQueryOptions = {
	categoryId?: string;
	month?: string;
};

export function useTransactionRepository() {
	const supabase = useSupabaseClient<Database>();

	async function insertTransaction() {}

	async function selectTransactions(options?: TransactionQueryOptions) {
		let query = supabase.from("transactions").select("*");

		if (options?.categoryId) {
			query.eq("category_id", options.categoryId);
		}

		if (options?.month) {
			const start = options.month;
			const end = getNextMonth(start);

			query = query
				.gte("transaction_date", start)
				.lt("transaction_date", end);
		}

		const { data, error } = await query;

		if (error) throw error;
		return data ?? [];
	}

	return {
		insertTransaction,
		selectTransactions,
	};
}
