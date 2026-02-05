<script setup lang="ts">
import { HouseholdRole } from "~/enums/household-role";

const { household } = useActiveHousehold();
const isMounted = ref(false);
const categories = ref<
	(Category & {
		transactions: Transaction[];
	})[]
>([]);

watch(
	household,
	(newHousehold) => {
		if (newHousehold) {
			isMounted.value = true;
		}
	},
	{ immediate: true },
);

const { getCategories } = useCategoryService();
const { getTransactionsByCategory } = useTransactionService();

onMounted(async () => {
	const { data: categoryData } = await getCategories();

	const categoryList = categoryData.value ?? [];

	const transactionsPerCategory = await Promise.all(
		categoryList.map(async (category) => {
			const { data } = await getTransactionsByCategory(category.id);
			return data.value ?? [];
		}),
	);

	const categoriesWithTransactions = categoryList.map((category, index) => ({
		...category,
		transactions: transactionsPerCategory[index] ?? [],
	}));

	categories.value = categoriesWithTransactions;
});
</script>
<template>
	<NuxtTime :datetime="Date.now()" />
	<h2
		class="text-2xl md:text-4xl font-semibold tracking-tight text-primary mb-16"
	>
		Household
		<span class="font-bold text-secondary dark:text-white">{{
			household?.name
		}}</span>
	</h2>

	<div>
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
				variant="soft"
				color="primary"
				class="cursor-pointer"
				icon="i-lucide-circle-plus"
				@click="navigateTo('/budget/category/create')"
			>
				Create new category
			</UButton>
		</div>
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
			<BudgetCard
				v-for="category in categories"
				:id="category.id"
				:name="category.name"
				:transactions="category.transactions"
			/>
		</div>
	</div>
</template>
