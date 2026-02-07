const CACHE_TTL = 10_000; // 10 seconds

const supplyCacheKey = {
	getTransactions: () => "transactions:all",
	getTransactionsByCategory: (categoryId: string) =>
		`transactions:by-category:${categoryId}`,
};

export function useTransactionService() {
	const { insertTransaction, selectTransactions, deleteTransactionById } =
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
			const { fetchedAt } = useCache(
				supplyCacheKey.getTransactions(),
				CACHE_TTL,
			);
			fetchedAt.value = null;

			const { fetchedAt: fetchedAtByCategory } = useCache(
				supplyCacheKey.getTransactionsByCategory(
					transaction.categoryId,
				),
				CACHE_TTL,
			);
			fetchedAtByCategory.value = null;

			await refreshNuxtData([
				supplyCacheKey.getTransactions(),
				supplyCacheKey.getTransactionsByCategory(
					transaction.categoryId,
				),
			]);
		}

		return result;
	}

	async function getTransactions() {
		const cacheKey = supplyCacheKey.getTransactions();
		const { fetchedAt } = useCache(cacheKey, CACHE_TTL);

		fetchedAt.value = Date.now();

		const transactions = await selectTransactions();
		return transactions;
	}

	function getTransactionsByCategory(categoryId: string) {
		const cacheKey = supplyCacheKey.getTransactionsByCategory(categoryId);
		const { fetchedAt } = useCache(cacheKey, CACHE_TTL);

		return useAsyncData(
			cacheKey,
			async () => {
				const transactions = await selectTransactions({ categoryId });
				fetchedAt.value = Date.now();

				return transactions;
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

	async function deleteTransaction(id: string) {
		const result = await deleteTransactionById(id);
		if (result) {
			const { fetchedAt } = useCache(
				supplyCacheKey.getTransactions(),
				CACHE_TTL,
			);
			fetchedAt.value = null;

			await refreshNuxtData([supplyCacheKey.getTransactions()]);
		}

		return result;
	}

	return {
		addTransaction,
		getTransactions,
		getTransactionsByCategory,
		deleteTransaction,
	};
}
