<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";

const route = useRoute();

const categoryId = route.params.categoryId as string;

const schema = z.object({
	date: z.string().refine((v) => !Number.isNaN(Date.parse(v)), {
		message: "Value must be date",
	}),
	amount: z.coerce.number().positive("Amount must be positive"),
	description: z.string().min(1, "Description is required"),
});
type Schema = z.output<typeof schema>;

const { addTransaction } = useTransactionService();

const state = reactive({
	date: "",
	amount: null,
	description: "",
});

function onSubmit(event: FormSubmitEvent<Schema>) {
	alert("Form submit");
	console.log(event.data);
	addTransaction({
		amount: event.data.amount,
		date: event.data.date,
		description: event.data.description,
		categoryId: categoryId,
		householdId: "some-household-id",
		userId: "some-user-id",
	});
}
</script>

<template>
	<div class="flex flex-col">
		<UForm :schema="schema" :state="state" @submit="onSubmit">
			<UFormField label="Date" name="date">
				<UInput v-model="state.date" type="date" size="md" />
			</UFormField>
			<UFormField label="Amount" name="amount">
				<UInput v-model="state.amount" type="number" size="md" />
			</UFormField>
			<UFormField label="Description" name="description">
				<UInput v-model="state.description" size="md" />
			</UFormField>
			<UButton type="submit" color="primary">Add Transaction</UButton>
		</UForm>
	</div>
</template>
