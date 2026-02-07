<script setup lang="ts">
const { loadHousehold } = useHouseholdService();

await loadHousehold();
</script>

<template>
	<NuxtPage />
</template>
