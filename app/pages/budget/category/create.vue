<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";
import { CategoryScope } from "~/enums/CategoryScope";

const { household } = useActiveHousehold();
const { loadHousehold } = useHouseholdService();
const { createCategory } = useCategoryService();

onMounted(async () => {
	await loadHousehold();
});

const error = ref<string | null>(null);

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

	if (!household.value) {
		error.value = "No active household found.";
		return;
	}

	createCategory(name, scope, household.value.id);
	error.value = null;
}
</script>

<template>
	<UPage>
		<h2
			class="text-2xl md:text-4xl font-semibold tracking-tight text-primary mb-16"
		>
			Create a new category
		</h2>

		<UForm
			:schema="schema"
			:state="state"
			class="space-y-4"
			@submit="onSubmit"
		>
			<UFormField label="Name" name="name" size="lg">
				<UInput
					v-model="state.name"
					:ui="{ root: 'w-full md:w-1/3' }"
				/>
			</UFormField>

			<UFormField label="Scope" name="scope" size="lg">
				<USelect
					v-model="state.scope"
					:items="items"
					:ui="{
						base: 'w-full md:w-1/3',
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
	</UPage>
</template>
