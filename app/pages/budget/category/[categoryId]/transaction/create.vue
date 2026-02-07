<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";

const route = useRoute();
const user = useSupabaseUser();

const { household } = useActiveHousehold();
const { addTransaction } = useTransactionService();
const { getCategoryById } = useCategoryService();

const categoryId = route.params.categoryId as string;

const schema = z.object({
	date: z.string().refine((v) => !Number.isNaN(Date.parse(v)), {
		message: "Value must be a valid date",
	}),
	amount: z.coerce.number().positive("Amount must be positive"),
	description: z.string().min(1, "Description is required"),
});
type Schema = z.output<typeof schema>;

const message = ref<{ text: string | null; type: "error" | "success" | null }>({
	type: null,
	text: null,
});

const state = reactive({
	date: "",
	amount: null,
	description: "",
});

const messageTitle = computed(() =>
	message.value.type === "success" ? "Success" : "Something went wrong",
);

async function onSubmit(event: FormSubmitEvent<Schema>) {
	// Clear any previous message
	message.value = { type: null, text: null };

	try {
		await addTransaction({
			amount: event.data.amount,
			categoryId: categoryId,
			date: event.data.date,
			description: event.data.description,
			householdId: household.value?.id!,
			userId: user.value?.sub!,
		});

		// Set success message
		message.value = {
			type: "success",
			text: "Transaction created successfully.",
		};

		// Optionally reset form state
		state.date = "";
		state.amount = null;
		state.description = "";
	} catch (error) {
		// Log and set error message
		console.error(error);
		message.value = {
			type: "error",
			text: "Failed to create transaction. Please try again.",
		};
	}
}

const { data: category } = getCategoryById(categoryId);
</script>

<template>
	<div class="flex items-start w-full gap-2 mb-4">
		<UButton
			:to="`/budget/category/${categoryId}`"
			variant="soft"
			color="primary"
			class="cursor-pointer"
			icon="i-lucide-arrow-left"
		>
			Back to category
		</UButton>
	</div>
	<h2
		class="text-2xl lg:text-4xl font-semibold tracking-tight text-primary mb-16"
	>
		Create a new transaction for
		<span class="text-white">{{ category?.name }}</span>
	</h2>
	<UForm
		:schema="schema"
		:state="state"
		class="space-y-4 w-full lg:w-1/3 mb-4"
		@submit="onSubmit"
	>
		<UFormField label="Date" name="date">
			<UInput
				v-model="state.date"
				type="date"
				size="md"
				:ui="{ root: 'w-full' }"
			/>
		</UFormField>
		<UFormField label="Amount" name="amount">
			<UInput
				v-model="state.amount"
				type="number"
				size="md"
				:ui="{ root: 'w-full' }"
			/>
		</UFormField>
		<UFormField label="Description" name="description">
			<UInput
				v-model="state.description"
				size="md"
				:ui="{ root: 'w-full' }"
			/>
		</UFormField>
		<UButton
			type="submit"
			class="cursor-pointer"
			variant="solid"
			color="primary"
		>
			Submit
		</UButton>
	</UForm>

	<UAlert
		v-if="message.type && message.text"
		:title="messageTitle"
		:description="message.text"
		:color="message.type"
		variant="subtle"
		class="w-full md:w-fit"
		icon="i-lucide-check-circle"
	/>
</template>
