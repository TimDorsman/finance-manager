<script setup lang="ts">
defineProps<{
	columns: number;
	rows: number;
}>();
</script>

<template>
	<div class="w-full bg-elevated/45 rounded pb-2">
		<div class="flex items-center justify-between gap-4 mb-2 py-4 px-2">
			<USkeleton
				v-for="column in columns"
				:key="column"
				class="h-6 w-10/12"
			/>
		</div>
		<div
			v-for="row in rows"
			:key="row"
			class="flex items-center justify-between gap-4 mb-2 px-2"
		>
			<USkeleton
				v-for="column in columns"
				:key="column"
				class="h-8 w-10/12"
			/>
		</div>
	</div>
</template>
