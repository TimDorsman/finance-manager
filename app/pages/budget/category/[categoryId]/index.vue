<script setup lang="ts">
import { getPaginationRowModel } from "@tanstack/vue-table";
import { toPageError } from "~/utils/toPageError";

type TransactionView = Omit<
	Transaction,
	"categoryId" | "date" | "householdId" | "amount"
> & {
	date: string;
	amount: string;
};

type PendingDelete =
	| {
			type: "category";
	  }
	| {
			type: "transaction";
			transactionId: string;
			description: string | null;
	  };

const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const errorMessage = ref<string | null>(null);
const isDeleteModalOpen = ref(false);
const pendingDelete = ref<PendingDelete | null>(null);
const pagination = ref({
	pageIndex: 0,
	pageSize: 10,
});

const route = useRoute();
const categoryId = route.params.categoryId as string;

const table = useTemplateRef("table");

const { getTransactionsByCategory, deleteTransaction } =
	useTransactionService();
const { deleteCategory, getCategoryById } = useCategoryService();

const { data: category, error: categoryError } = getCategoryById(categoryId);
const {
	data: transactions,
	refresh: refreshTransactions,
	error: transactionsError,
} = await getTransactionsByCategory(categoryId);

if (transactionsError.value) {
	throw toPageError(
		transactionsError.value,
		400,
		"Failed to load transactions.",
	);
}

if (categoryError.value) {
	throw toPageError(categoryError.value, 404, "Category not found.");
}

const transactionsView = computed<TransactionView[]>(() =>
	transactions.value.map((transaction) => ({
		id: transaction.id,
		amount: transaction.amount.toFixed(2),
		description: transaction.description,
		date: new Date(transaction.date).toLocaleDateString(),
		createdBy: transaction.createdBy,
	})),
);

const deleteMessage = computed(() => {
	if (!pendingDelete.value) {
		return "";
	}

	if (pendingDelete.value.type === "category") {
		return "Are you sure you want to delete this category?";
	}

	return `Are you sure you want to delete transaction "${pendingDelete.value.description ?? "(no description)"}"?`;
});

const deleteConfirmLabel = computed(() => {
	if (!pendingDelete.value) {
		return "Delete";
	}

	return pendingDelete.value.type === "category"
		? "Delete category"
		: "Delete transaction";
});

const deleteCurrentCategory = async () => {
	try {
		const deleteError = await deleteCategory(categoryId);
		if (deleteError) {
			errorMessage.value = `Failed to delete category: ${deleteError.message}`;
			return;
		}

		await navigateTo("/budget/overview");
	} catch {
		errorMessage.value = "Failed to delete category.";
	}
};

const deleteCurrentTransaction = async (id: string) => {
	try {
		const result = await deleteTransaction(id);
		if (!result) {
			errorMessage.value = "Failed to delete transaction";
			return;
		}

		await refreshTransactions();
	} catch {
		errorMessage.value = "Failed to delete transaction";
	}
};

const onConfirmDelete = async () => {
	if (!pendingDelete.value) {
		isDeleteModalOpen.value = false;
		return;
	}

	if (pendingDelete.value.type === "category") {
		await deleteCurrentCategory();
	} else {
		await deleteCurrentTransaction(pendingDelete.value.transactionId);
	}

	pendingDelete.value = null;
	isDeleteModalOpen.value = false;
};

const requestDeleteCategory = () => {
	pendingDelete.value = { type: "category" };
	isDeleteModalOpen.value = true;
};

const requestDeleteTransaction = (row: TransactionView) => {
	pendingDelete.value = {
		type: "transaction",
		transactionId: row.id,
		description: row.description,
	};
	isDeleteModalOpen.value = true;
};

watch(isDeleteModalOpen, (open) => {
	if (!open) {
		// Delay resetting pendingDelete to allow modal close animation to finish
		setTimeout(() => {
			pendingDelete.value = null;
		}, 300);
	}
});

watch(transactionsError, (newError) => {
	if (newError) {
		errorMessage.value = "Failed to load transactions.";
		transactions.value = [];
	}
});

const columns = computed(() => [
	...Object.keys(transactionsView.value[0] ?? {})
		.filter((key) => key !== "id")
		.map((key) => ({
			accessorKey: key,
			header: TextTransformer.camelToTitle(key),
		})),
	{
		id: "action",
	},
]);

function getDropdownActions(row: TransactionView) {
	return [
		[
			{
				label: "Edit",
				icon: "i-lucide-edit",
			},
			{
				label: "Delete",
				icon: "i-lucide-trash",
				color: "error",
				onSelect: () => requestDeleteTransaction(row),
			},
		],
	];
}
</script>

<template>
	<div class="flex items-start w-full gap-2 mb-4">
		<UButton
			to="/budget/overview"
			variant="soft"
			color="primary"
			class="cursor-pointer"
			icon="i-lucide-arrow-left"
		>
			Back to overview
		</UButton>

		<div class="flex gap-2 ml-auto">
			<UButton
				variant="subtle"
				color="primary"
				icon="i-lucide-plus"
				@click="
					navigateTo(
						`/budget/category/${categoryId}/transaction/create`,
					)
				"
			>
				Add transaction
			</UButton>

			<UButton
				variant="subtle"
				color="error"
				icon="i-lucide-trash"
				@click="requestDeleteCategory"
			>
				Delete
			</UButton>
		</div>
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

	<div class="overflow-x-auto max-w-[90vw] mx-auto px-4">
		<UTable
			v-model:pagination="pagination"
			:data="transactionsView"
			:columns="columns"
			class="flex-1 min-w-max"
			:pagination-options="{
				getPaginationRowModel: getPaginationRowModel(),
			}"
			ref="table"
		>
			<template #action-cell="{ row }">
				<UDropdownMenu :items="getDropdownActions(row.original)">
					<UButton
						icon="i-lucide-ellipsis-vertical"
						color="neutral"
						variant="ghost"
						aria-label="Actions"
					/>
				</UDropdownMenu>
			</template>
			<template #date-header>
				<div class="flex items-center gap-2">
					<UIcon name="i-lucide-calendar" />
					Date
				</div>
			</template>
		</UTable>
	</div>
	<div
		v-if="pagination.pageSize < transactionsView.length"
		class="flex justify-end border-t border-default pt-4 px-4"
	>
		<UPagination
			:page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
			:items-per-page="table?.tableApi?.getState().pagination.pageSize"
			:total="table?.tableApi?.getFilteredRowModel().rows.length"
			@update:page="(page) => table?.tableApi?.setPageIndex(page - 1)"
		/>
	</div>
	<PromptModal
		v-model:open="isDeleteModalOpen"
		:message="deleteMessage"
		:confirm-label="deleteConfirmLabel"
		@confirm="onConfirmDelete"
		:portal="true"
		:dismissible="true"
	/>
</template>
