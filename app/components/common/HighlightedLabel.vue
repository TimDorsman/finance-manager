<script setup lang="ts">
import { useColorMode } from "@vueuse/core";
import { colord } from "colord";

const props = defineProps<{ color: string }>();
const colorMode = useColorMode();

const colorStyle = computed(() => {
	if (colorMode.value === "light") {
		return {
			backgroundColor: colord(props.color).alpha(0.3).toHex(),
			color: colord(props.color).darken(0.4).toHex(),
		};
	}

	return {
		backgroundColor: colord(props.color).alpha(0.6).toHex(),
		color: colord(props.color).lighten(0.4).toHex(),
	};
});
</script>

<template>
	<span
		class="text-lg font-semibold my-4 py-0.5 px-2 rounded"
		:style="colorStyle"
	>
		<slot />
	</span>
</template>
