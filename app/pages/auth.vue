<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";

const fields: AuthFormField[] = [
	{
		name: "email",
		type: "email",
		label: "Email",
		placeholder: "Enter your email",
		required: true,
	},
	{
		name: "password",
		label: "Password",
		type: "password",
		placeholder: "Enter your password",
		required: true,
	},
];

const schema = z.object({
	email: z.email("Invalid email"),
	password: z
		.string("Password is required")
		.min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

const supabase = useSupabaseClient();

const error = ref<string | null>(null);

async function onSubmit(payload: FormSubmitEvent<Schema>) {
	const { email, password } = payload.data;
	error.value = null;

	const { error: errorResponse } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (errorResponse) {
		error.value = errorResponse.message;
		return;
	}

	await navigateTo("/overview");
}
function onUpdateOpen(isOpen: boolean) {
	if (!isOpen) {
		// User closed the alert
		error.value = null;
	}
}
</script>

<template>
	<main class="flex-1 flex justify-center">
		<div
			class="flex flex-col items-center justify-center gap-4 pt-[10vh] md:pt-[25vh]"
		>
			<UPageCard class="w-full max-w-md">
				<UAuthForm
					:schema="schema"
					title="Login"
					description="Enter your credentials to access your account."
					icon="i-lucide-user"
					:fields="fields"
					@submit.prevent="onSubmit"
				/>

				<UAlert
					v-if="error"
					:title="error"
					color="error"
					variant="soft"
					close
					class="mt-2"
					@update:open="onUpdateOpen"
				/>
			</UPageCard>
		</div>
	</main>
</template>
