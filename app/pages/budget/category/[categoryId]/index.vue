<script setup lang="ts">
type TransactionView = Omit<
	Transaction,
	"id" | "categoryId" | "date" | "householdId" | "amount"
> & {
	date: string;
	amount: string;
};

const errorMessage = ref<string | null>(null);
const isDeleteModalOpen = ref(false);

const route = useRoute();
const categoryId = route.params.categoryId as string;

const { getTransactionsByCategory } = useTransactionService();
const { deleteCategory, getCategoryById } = useCategoryService();

const { data: category } = getCategoryById(categoryId);
const { data: transactions, error } =
	await getTransactionsByCategory(categoryId);

const transactionsView = computed<TransactionView[]>(() =>
	transactions.value.map((transaction) => ({
		date: new Date(transaction.date).toLocaleDateString(),
		amount: transaction.amount.toFixed(2),
		description: transaction.description,
		createdBy: transaction.createdBy,
	})),
);

const deleteCurrentCategory = async () => {
	return;
	// const deleteError = await deleteCategory(categoryId);
	// if (deleteError) {
	// 	errorMessage.value = `Failed to delete category: ${deleteError.message}`;
	// 	return;
	// }
	// await navigateTo("/budget/overview");
};

watch(error, (newError) => {
	if (newError) {
		errorMessage.value = "Failed to load transactions.";
		transactions.value = [];
	}
});
</script>

<template>
	<div class="flex flex-row items-start w-fit ml-auto gap-2">
		<UButton
			variant="subtle"
			color="primary"
			class="cursor-pointer mb-4"
			icon="i-lucide-plus"
			@click="
				navigateTo(`/budget/category/${categoryId}/transaction/add`)
			"
		>
			Add transaction
		</UButton>
		<UButton
			variant="subtle"
			color="error"
			class="cursor-pointer mb-4"
			icon="i-lucide-trash"
			@click="isDeleteModalOpen = true"
		>
			Delete
		</UButton>
	</div>
	<h2
		class="text-2xl lg:text-4xl font-semibold tracking-tight text-white mb-16"
	>
		{{ category?.name }}
	</h2>

	<BudgetBarChart
		v-if="transactions.length > 0"
		:data="getSpendAmountPerMonth(transactions)"
		class="w-3/5 mx-auto mb-4 block"
	/>

	<UAlert
		v-if="errorMessage"
		color="error"
		variant="subtle"
		class="w-fit m-auto mb-4"
		icon="i-lucide-circle-alert"
		:description="errorMessage"
	/>

	<UTable :data="transactionsView" class="flex-1" />
	<Teleport to="body">
		<PromptModal
			v-model:open="isDeleteModalOpen"
			message="Are you sure you want to delete this category?"
			confirm-label="Delete"
			@confirm="deleteCurrentCategory"
		/>
	</Teleport>
</template>
