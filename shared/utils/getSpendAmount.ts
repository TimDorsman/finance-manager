import type { Transaction } from "../types/transaction";

export function getSpendAmountPerMonth(transactions: Transaction[]): number[] {
	transactions = [...transactions];

	const totalPerMonth: number[] = Array(12).fill(0);

	transactions
		.sort((a, b) => {
			const aTime = a.date.getTime();
			const bTime = b.date.getTime();

			if (aTime < bTime) {
				return 1;
			}

			if (aTime > bTime) {
				return -1;
			}

			return 0;
		})
		.forEach((transaction) => {
			const monthIndex = transaction.date.getMonth();

			if (Number.isNaN(totalPerMonth[monthIndex])) {
				return;
			}

			let total: number = totalPerMonth[monthIndex] ?? 0;
			total += transaction.amount;

			totalPerMonth[monthIndex] = total;
		});

	return totalPerMonth;
}
