import { tr } from "zod/locales";

export function useTransactionService() {
	const { insertTransaction, selectTransactions } =
		useTransactionRepository();

	function addTransaction() {
		// @TODO implement it
	}

	async function getTransactions() {
		const transactions = await selectTransactions();
		return transactions;
	}

	async function getTransactionsByCategory(categoryId: string): Promise<
		{
			id: string;
			categoryId: string;
			amount: number;
			date: Date;
			createdBy: string;
			description: string | null;
		}[]
	> {
		const transactions = await selectTransactions({ categoryId });

		return transactions.map((transaction) => ({
			id: transaction.id,
			categoryId: transaction.category_id,
			amount: transaction.amount,
			date: new Date(transaction.transaction_date),
			createdBy: transaction.user_id,
			description: transaction.description,
		}));
	}

	return {
		addTransaction,
		getTransactions,
		getTransactionsByCategory,
	};
}
