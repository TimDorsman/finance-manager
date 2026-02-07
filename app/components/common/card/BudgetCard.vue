<script setup lang="ts">
const props = defineProps<{
	id: string;
	name: string;
	transactions: Transaction[];
}>();

const getTotalSpendCurrentMonth = computed(() =>
	props.transactions
		.filter(
			(transaction) =>
				new Date(transaction.date).getMonth() ===
					new Date().getMonth() &&
				new Date(transaction.date).getFullYear() ===
					new Date().getFullYear(),
		)
		.reduce((prev, curr) => (prev += curr.amount), 0),
);
</script>

<template>
	<div
		:key="id"
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
			<li>Spent: €{{ getTotalSpendCurrentMonth }}</li>
		</ul>

		<BudgetBarChart :data="getSpendAmountPerMonth(transactions)" />
	</div>
</template>
