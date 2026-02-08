import type { Transaction } from "../types/transaction";

export function getSpendAmountPerMonth(transactions: Transaction[]): number[] {
	transactions = [...transactions];

	const totalPerMonth: number[] = Array(12).fill(0);

	transactions.forEach((transaction) => {
		const transactionDate = new Date(transaction.date);
		const monthIndex = transactionDate.getMonth();
		const year = transactionDate.getFullYear();

		if (year !== new Date().getFullYear()) {
			return;
		}

		if (Number.isNaN(totalPerMonth[monthIndex])) {
			return;
		}

		let total: number = totalPerMonth[monthIndex] ?? 0;
		total += transaction.amount;

		totalPerMonth[monthIndex] = total;
	});

	return totalPerMonth;
}

export function getSpendAmountByMonth(
	transactions: Transaction[],
	date: Date,
): number {
	const currentMonth = date.getMonth();
	const currentYear = date.getFullYear();

	return transactions
		.filter((transaction) => {
			const transactionDate = new Date(transaction.date);
			return (
				transactionDate.getMonth() === currentMonth &&
				transactionDate.getFullYear() === currentYear
			);
		})
		.reduce((total, transaction) => total + transaction.amount, 0);
}
