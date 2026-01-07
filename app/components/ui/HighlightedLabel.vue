<script setup lang="ts">
import { colord } from "colord";

defineProps<{ color: string }>();
</script>

<template>
	<span
		class="text-lg font-semibold my-4 py-0.5 px-1 rounded border"
		:style="{
			borderColor: color,
			color: colord(color).lighten(0.25).toHex(),
		}"
	>
		<slot />
	</span>
</template>
