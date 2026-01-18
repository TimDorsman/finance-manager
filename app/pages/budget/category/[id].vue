<script setup lang="ts">
type TransactionView = Omit<
	Transaction,
	"id" | "categoryId" | "date" | "householdId" | "amount"
> & {
	date: string;
	amount: string;
};

const transactions = ref<Transaction[]>([]);
const error = ref<string | null>(null);

const route = useRoute();
const categoryId = route.params.id as string;

const { getTransactionsByCategory } = useTransactionService();

const transactionsView = computed<TransactionView[]>(() =>
	transactions.value.map((transaction) => ({
		date: new Date(transaction.date).toLocaleDateString(),
		amount: transaction.amount.toFixed(2),
		description: transaction.description,
		createdBy: transaction.createdBy,
	})),
);

onMounted(async () => {
	try {
		transactions.value = await getTransactionsByCategory(categoryId);
	} catch (e) {
		error.value = "Failed to display bar chart.";
	}
});
</script>

<template>
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
</template>
