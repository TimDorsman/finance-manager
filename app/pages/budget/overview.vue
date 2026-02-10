<script setup lang="ts">
import { HouseholdRole } from "~/enums/household-role";

const { household } = useActiveHousehold();

const { getCategories } = useCategoryService();
const { getTransactions } = useTransactionService();

const {
	data: categories,
	pending,
	error,
	refresh,
} = await useAsyncData(
	"categoriesWithTransactions",
	async () => {
		if (!household.value) return [];

		const [categoryResult, transactions] = await Promise.all([
			getCategories(),
			getTransactions(),
		]);

		const categoryList = categoryResult.data.value ?? [];

		const transactionsByCategoryId = transactions.reduce<
			Record<string, typeof transactions>
		>((acc, transaction) => {
			const key = transaction.categoryId;
			if (!acc[key]) {
				acc[key] = [];
			}
			acc[key].push(transaction);
			return acc;
		}, {});

		return categoryList.map((category) => ({
			...category,
			transactions: transactionsByCategoryId[category.id] ?? [],
		}));
	},
	{
		default: () => [],
		watch: [household],
	},
);
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
				v-for="category in categories"
				:key="category.id"
				:id="category.id"
				:name="category.name"
				:transactions="category.transactions"
			/>
		</div>
	</div>
</template>
