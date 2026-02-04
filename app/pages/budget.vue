<script setup lang="ts">
const { loadHousehold } = useHouseholdService();

await loadHousehold();

const route = useRoute();
</script>

<template>
	<NuxtLayout name="budget">
		<NuxtPage />
	</NuxtLayout>
</template>
