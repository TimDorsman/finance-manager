<script setup lang="ts">
const user = useSupabaseUser();

if (user.value) {
	navigateTo("/overview");
}

const supabase = useSupabaseClient();

const state = reactive({
	email: "",
	password: "",
});

const error = ref<string | null>(null);

async function onSubmit() {
	error.value = null;
	const { error: errorResponse } = await supabase.auth.signInWithPassword({
		email: state.email,
		password: state.password,
	});

	if (errorResponse) {
		error.value = errorResponse.message;
		return;
	}

	navigateTo("/overview");
}

function onUpdateOpen(isOpen: boolean) {
	if (!isOpen) {
		// User closed the alert
		error.value = null;
	}
}
</script>

<template>
	<div class="grid grid-cols-1 place-items-center">
		<div>
			<UForm
				:state="state"
				class="p-4 border w-fit rounded-lg mx-auto"
				@submit.prevent="onSubmit"
			>
				<UFormField label="Email" name="email">
					<UInput type="email" v-model="state.email" />
				</UFormField>

				<UFormField label="Password" name="password">
					<UInput v-model="state.password" type="password" />
				</UFormField>

				<UButton type="submit">Submit</UButton>
			</UForm>
			<UAlert
				v-if="error"
				title="Invalid credentials"
				:description="error"
				color="error"
				variant="outline"
				close
				@update:open="onUpdateOpen"
			/>
		</div>
	</div>
</template>
