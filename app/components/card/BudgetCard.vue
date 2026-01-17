<script setup lang="ts">
const props = defineProps<{
	id: string;
	name: string;
	transactions: Transaction[];
}>();

const getSpendAmountPerMonth = (transactions: Transaction[]) => {
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
};

const getTotalSpendCurentMonth = computed(
	() =>
		props.transactions
			.filter(
				(transaction) =>
					transaction.date.getMonth() === new Date().getMonth() &&
					transaction.date.getFullYear() === new Date().getFullYear()
			)
			.reduce((prev, curr) => (prev += curr.amount), 0)

	// props.transactions.reduce((prev, curr) => (prev += curr.amount), 0)
);
</script>

<template>
	<div
		:key="id"
		class="mt-6 p-4 bg-default/70 backdrop-blur border border-default rounded-lg shadow-sm"
	>
		<p class="text-lg font-medium text-primary">
			{{ name }}
		</p>
		<p class="font-medium mt-2">This month:</p>
		<ul class="list-disc pl-5">
			<li>Budget: €200</li>
			<li>Spent: €{{ getTotalSpendCurentMonth }}</li>
		</ul>

		<BudgetBarChart :data="getSpendAmountPerMonth(transactions)" />
	</div>
</template>
