<script setup lang="ts">
const { fetchHousehold } = useActiveHousehold();

await fetchHousehold();
</script>

<template>
	<NuxtPage />
</template>
