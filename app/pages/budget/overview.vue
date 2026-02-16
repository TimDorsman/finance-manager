<script setup lang="ts">
import { HouseholdRole } from "~/enums/household-role";

const { household } = useActiveHousehold();

const {
	data: categories,
	pending: categoriesPending,
	error: categoriesError,
} = await useFetch<Category[]>("/api/categories", {
	watch: [household],
	default: () => [],
});

const {
	data: transactions,
	pending: transactionsPending,
	error: transactionsError,
} = await useFetch<Transaction[]>("/api/transactions", {
	watch: [household],
	default: () => [],
});

const pending = computed(
	() => categoriesPending.value || transactionsPending.value,
);

const error = computed(() => categoriesError.value || transactionsError.value);

const categoriesWithTransactions = computed(() => {
	const categoryList = Array.isArray(categories.value)
		? categories.value
		: [];

	const transactionList = Array.isArray(transactions.value)
		? transactions.value
		: [];

	const transactionsByCategoryId = transactionList.reduce(
		(acc: Record<string, Transaction[]>, transaction) => {
			const key = transaction.categoryId;
			if (!key) return acc;

			(acc[key] ??= []).push(transaction);
			return acc;
		},
		{},
	);

	return categoryList.map((category) => ({
		...category,
		transactions: transactionsByCategoryId[category.id] ?? [],
	}));
});
</script>

<template>
	<h2
		class="text-2xl md:text-4xl font-semibold tracking-tight text-primary mb-8 md:mb-16"
	>
		Household
		<span class="font-bold text-secondary dark:text-white">
			{{ household?.name }}
		</span>
	</h2>

	<div v-if="pending">Loading</div>
	<div v-else-if="error">Failed to load</div>

	<div v-else>
		<div
			class="flex flex-col md:flex-row items-start md:items-center justify-between gap-y-4 md:gap-0"
		>
			<h3
				class="text-xl font-medium text-secondary dark:text-white w-fit pb-2 border-b-2 border-secondary dark:border-white"
			>
				Your budget categories
			</h3>

			<UButton
				v-if="household?.role === HouseholdRole.Admin"
				class="cursor-pointer"
				variant="soft"
				color="primary"
				icon="i-lucide-circle-plus"
				@click="navigateTo('/budget/category/create')"
			>
				Create new category
			</UButton>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-x-6 mt-6">
			<BudgetCard
				v-for="category in categoriesWithTransactions"
				:key="category.id"
				:id="category.id"
				:name="category.name"
				:transactions="category.transactions"
			/>
		</div>
	</div>
</template>
