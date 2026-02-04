<script setup lang="ts">
const route = useRoute();
const isOverviewPage = computed(() => route.path === "/budget/overview");
</script>

<template>
	<div class="flex flex-col items-start justify-between">
		<UButton
			v-if="!isOverviewPage"
			to="/budget/overview"
			variant="soft"
			color="primary"
			class="cursor-pointer mb-4"
			icon="i-lucide-arrow-left"
		>
			Back to overview
		</UButton>
		<slot name="actionButtons" />
	</div>

	<NuxtPage />
</template>
