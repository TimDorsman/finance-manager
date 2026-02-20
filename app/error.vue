<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps({
	error: Object as () => NuxtError,
});

onMounted(() => {
	console.error("Nuxt error:", props.error);
});

const title = computed(() => {
	switch (props.error?.statusCode) {
		case 404:
			return "Oopsie... I do not exist";
		case 500:
			return "Something went wrong on our end...";
		default:
			return "Uh-oh! An unexpected error occurred";
	}
});

const description = computed(() => {
	if (
		props.error?.message &&
		props.error.message !== String(props.error.statusCode)
	) {
		return props.error.message;
	}

	switch (props.error?.statusCode) {
		case 404:
			return "I'm so sorry but you aren't supposed to see this. I'm asking you nicely to leave... NOW!";
		case 500:
			return "Our servers are having a little trouble. Please try again later.";
		default:
			return "An unexpected error has occurred. Please try again later.";
	}
});

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
	<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
		<div
			class="w-[92vw] max-w-lg md:max-w-xl bg-default/70 backdrop-blur border border-default rounded-2xl shadow-lg p-6 md:p-8 text-center"
		>
			<h2
				class="text-2xl md:text-4xl font-semibold tracking-tight text-primary"
			>
				{{ title }}
			</h2>
			<img
				src="/images/error.png"
				alt="Error illustration"
				class="mx-auto mt-4 md:mt-6"
			/>
			<p
				class="mt-2 md:mt-3 text-gray-600 dark:text-gray-300 leading-relaxed"
			>
				{{ description }}
			</p>
			<UButton
				variant="soft"
				size="md"
				color="primary"
				class="mt-4 md:mt-6 cursor-pointer transition-transform hover:scale-[1.02]"
				@click="handleError"
			>
				Go back
			</UButton>
		</div>
	</div>
</template>
