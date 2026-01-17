<script setup lang="ts">
const { loadHousehold } = useHouseholdService();

await loadHousehold();

const route = useRoute();
const isOverviewPage = computed(() => {
	if (route.path === "/budget/overview") {
		return true;
	}
	return false;
});
</script>

<template>
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
	<NuxtPage />
</template>
