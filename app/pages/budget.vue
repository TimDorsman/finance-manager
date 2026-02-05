<script setup lang="ts">
const { loadHousehold } = useHouseholdService();

await loadHousehold();
</script>

<template>
	<NuxtLayout name="budget">
		<NuxtPage />
	</NuxtLayout>
</template>
