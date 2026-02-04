<script setup lang="ts">
type TransactionView = Omit<
	Transaction,
	"id" | "categoryId" | "date" | "householdId" | "amount"
> & {
	date: string;
	amount: string;
};

const categoryInformation = ref<Category | null>(null);
const transactions = ref<Transaction[]>([]);
const error = ref<string | null>(null);
const isDeleteModalOpen = ref(false);

const route = useRoute();
const categoryId = route.params.categoryId as string;

const { getTransactionsByCategory } = useTransactionService();
const { deleteCategory, getCategoryById } = useCategoryService();

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
	// 	error.value = `Failed to delete category: ${deleteError.message}`;
	// 	return;
	// }
	// await navigateTo("/budget/overview");
};

onMounted(async () => {
	try {
		categoryInformation.value = await getCategoryById(categoryId);
	} catch (e) {
		alert("Failed to load category information.");
		return;
	}

	try {
		transactions.value = await getTransactionsByCategory(categoryId);
	} catch (e) {
		error.value = "Failed to display bar chart.";
	}
});
</script>

<template>
	<div class="flex flex-row items-start w-fit ml-auto gap-2">
		<UButton
			variant="subtle"
			color="primary"
			class="cursor-pointer mb-4"
			icon="i-lucide-edit-2"
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
	<BudgetBarChart
		v-if="transactions.length > 0"
		:data="getSpendAmountPerMonth(transactions)"
		class="w-3/5 mx-auto mb-4 block"
	/>

	<UAlert
		v-if="error"
		color="error"
		variant="subtle"
		class="w-fit m-auto mb-4"
		icon="i-lucide-circle-alert"
		:description="error"
	/>

	<UTable :data="transactionsView" class="flex-1" />
	<PromptModal
		v-model:open="isDeleteModalOpen"
		message="Are you sure you want to delete this category?"
		confirm-label="Delete"
		@confirm="deleteCurrentCategory"
	/>
</template>
