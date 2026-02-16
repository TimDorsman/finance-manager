<script setup lang="ts">
const props = defineProps<{
	id: string;
	name: string;
	transactions: Transaction[];
}>();

const getSpendCurrentMonth = computed(() => {
	const currentDate = new Date();
	const currentMonth = currentDate.getMonth();
	const currentYear = currentDate.getFullYear();

	return props.transactions
		.filter((transaction) => {
			const transactionDate = new Date(transaction.date);
			return (
				transactionDate.getMonth() === currentMonth &&
				transactionDate.getFullYear() === currentYear
			);
		})
		.reduce((total, transaction) => total + transaction.amount, 0);
});
</script>

<template>
	<div
		class="mt-6 p-4 bg-default/70 backdrop-blur border border-default rounded-lg shadow-sm"
	>
		<div class="flex flex-row justify-between gap-2 align-start">
			<h4 class="text-lg font-medium text-primary">
				<NuxtLink
					:to="`/budget/category/${id}`"
					class="border-b-2 border-transparent hover:border-inherit cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
				>
					{{ name }}
				</NuxtLink>
			</h4>
			<UButton
				size="sm"
				variant="soft"
				color="primary"
				class="cursor-pointer self-start"
				icon="i-lucide-eye"
				@click="navigateTo(`/budget/category/${id}`)"
			>
				<span class="hidden sm:inline">View details</span>
			</UButton>
		</div>
		<p class="font-medium mt-2">This month:</p>
		<ul class="list-disc pl-5">
			<li>Budget: €200</li>
			<li>Spent: €{{ getSpendCurrentMonth }}</li>
		</ul>

		<BudgetBarChart :data="getSpendAmountPerMonth(transactions)" />
	</div>
</template>
