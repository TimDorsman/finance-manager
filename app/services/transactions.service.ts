const CACHE_TTL = 60_000; // 1 minute

const supplyCacheKey = {
	getTransactions: () => "transactions:all",
	getTransactionsByCategory: (categoryId: string) =>
		`transactions:by-category:${categoryId}`,
};

export function useTransactionService() {
	const { insertTransaction, selectTransactions } =
		useTransactionRepository();

	async function addTransaction(transaction: {
		amount: number;
		categoryId: string;
		date: string;
		description: string;
		householdId: string;
		userId: string;
	}) {
		const result = await insertTransaction(transaction);
		if (result) {
			const cacheKey = supplyCacheKey.getTransactions();
			useFetchedAt(cacheKey).value = null;
			await refreshNuxtData(cacheKey);
		}

		return result;
	}

	async function getTransactions() {
		const cacheKey = supplyCacheKey.getTransactions();
		const fetchedAt = useFetchedAt(cacheKey);
		fetchedAt.value = Date.now();

		const transactions = await selectTransactions();
		return transactions;
	}

	function getTransactionsByCategory(categoryId: string) {
		const cacheKey = supplyCacheKey.getTransactionsByCategory(categoryId);
		const fetchedAt = useFetchedAt(cacheKey);

		return useAsyncData(
			`${cacheKey}:${categoryId}`,
			async () => {
				const transactions = await selectTransactions({ categoryId });
				fetchedAt.value = Date.now();

				return transactions.map((transaction) => ({
					id: transaction.id,
					amount: transaction.amount,
					categoryId: transaction.category_id,
					createdBy: transaction.user_id,
					date: new Date(transaction.transaction_date),
					description: transaction.description,
				}));
			},
			{
				default: () => [],
				getCachedData(key, nuxtApp) {
					if (!fetchedAt.value) return;
					if (Date.now() - fetchedAt.value > CACHE_TTL) return;

					return nuxtApp.payload.data[key];
				},
			},
		);
	}

	return {
		addTransaction,
		getTransactions,
		getTransactionsByCategory,
	};
}
