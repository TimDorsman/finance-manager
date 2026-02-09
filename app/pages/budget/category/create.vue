<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";
import { CategoryScope } from "~/enums/category-scope";

const { household } = useActiveHousehold();
const { addCategory } = useCategoryService();

const message = ref<{ text: string | null; type: "error" | "success" | null }>({
	type: null,
	text: null,
});

const items = ref<CategoryScope[]>([
	CategoryScope.Household,
	CategoryScope.Personal,
]);

const state = reactive<{
	name: string;
	scope: CategoryScope;
}>({
	name: "",
	scope: CategoryScope.Household,
});

const schema = z.object({
	name: z.string().min(1, "Name is required"),
	scope: z.enum(["household", "personal"], {
		error: "Type is required",
	}),
});

type Schema = z.output<typeof schema>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
	const { name, scope } = payload.data;
	message.value = { text: null, type: null };

	if (!household.value) {
		message.value = { text: "No active household found.", type: "error" };
		return;
	}

	const error = await addCategory(name, scope, household.value.id);

	if (error === null) {
		message.value = {
			text: "Category created successfully.",
			type: "success",
		};
		state.name = "";
		state.scope = CategoryScope.Household;
		return;
	}

	if (error) {
		message.value = { text: error.message, type: "error" };
		return;
	}
}

const messageTitle = computed(() =>
	message.value.type === "success" ? "Success" : "Something went wrong",
);
</script>

<template>
	<UPage>
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
		</div>

		<h2
			class="text-2xl lg:text-4xl font-semibold tracking-tight text-primary mb-16"
		>
			Create a new category
		</h2>

		<UForm
			:schema="schema"
			:state="state"
			class="space-y-4 w-full lg:w-1/3 mb-4"
			@submit="onSubmit"
		>
			<UFormField label="Name" name="name" size="lg">
				<UInput v-model="state.name" :ui="{ root: 'w-full' }" />
			</UFormField>

			<UFormField label="Scope" name="scope" size="lg">
				<USelect
					v-model="state.scope"
					:items="items"
					:ui="{
						base: 'w-full',
					}"
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
	</UPage>
</template>
