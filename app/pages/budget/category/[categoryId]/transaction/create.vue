<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";

const route = useRoute();
const user = useSupabaseUser();
const categoryId = route.params.categoryId as string;

const { household } = useActiveHousehold();
const { addTransaction } = useTransactionService();
const { getCategoryById } = useCategoryService();
const { data: category } = getCategoryById(categoryId);

const schema = z.object({
	date: z.string().refine((v) => !Number.isNaN(Date.parse(v)), {
		message: "Value must be a valid date",
	}),
	amount: z.coerce.number().positive("Amount must be positive"),
	description: z.string().min(1, "Description is required"),
});
type Schema = z.output<typeof schema>;

type FormState = {
	date: string;
	amount: number | null;
	description: string;
};

const message = ref<{ text: string | null; type: "error" | "success" | null }>({
	type: null,
	text: null,
});

const initialState = (): FormState => ({
	date: "",
	amount: null,
	description: "",
});
const formState = reactive(initialState());

const messageTitle = computed(() =>
	message.value.type === "success" ? "Success" : "Something went wrong",
);

type FieldModel = keyof FormState;

type FormField = {
	label: string;
	name: FieldModel;
	type: string;
	model: FieldModel;
};

const baseFormFields: Array<Omit<FormField, "model">> = [
	{ label: "Date", name: "date", type: "date" },
	{ label: "Amount", name: "amount", type: "number" },
	{
		label: "Description",
		name: "description",
		type: "text",
	},
];

const formFields: FormField[] = baseFormFields.map((field) => ({
	...field,
	model: field.name,
}));
async function onSubmit(event: FormSubmitEvent<Schema>) {
	message.value = { type: null, text: null };
	try {
		await addTransaction({
			amount: event.data.amount,
			categoryId,
			date: event.data.date,
			description: event.data.description,
			householdId: household.value?.id!,
			userId: user.value?.sub!,
		});
		message.value = {
			type: "success",
			text: "Transaction created successfully.",
		};
		Object.assign(formState, initialState());
	} catch (error) {
		console.error(error);
		message.value = {
			type: "error",
			text: "Failed to create transaction. Please try again.",
		};
	}
}

const messageIcon = computed(() =>
	message.value.type === "success"
		? "i-lucide-check-circle"
		: "i-lucide-x-circle",
);
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
			<span class="hidden sm:inline">Back to category</span>
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
		:state="formState"
		class="space-y-4 w-full lg:w-1/3 mb-4"
		@submit="onSubmit"
	>
		<template v-for="field in formFields" :key="field.name">
			<UFormField :label="field.label" :name="field.name">
				<UInput
					v-model="formState[field.model]"
					:type="field.type"
					size="md"
					:ui="{ root: 'w-full' }"
				/>
			</UFormField>
		</template>
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
		:icon="messageIcon"
		variant="subtle"
		class="w-full md:w-fit"
	/>
</template>
