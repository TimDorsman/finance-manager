<script setup lang="ts">
withDefaults(
	defineProps<{
		name: string;
		image: string | null;
		id: string;
		hasFavorite?: boolean;
		isFavorite?: boolean;
	}>(),
	{
		hasFavorite: false,
		isFavorite: false,
	}
);
</script>

<template>
	<UCard :key="id" class="shadow-xl">
		<template #header>
			<span class="font-bold">{{ $props.name }}</span>
		</template>

		<img
			v-if="image"
			:src="image"
			:alt="`Image of ${$props.name}`"
			class="max-w-40 max-h-40 w-full h-40 object-contain mx-auto"
		/>
		<template #footer>
			<div class="flex align-center justify-between gap-2">
				<slot name="buttons" />
				<UButton
					v-if="hasFavorite"
					variant="outline"
					size="sm"
					color="warning"
					class="cursor-pointer"
				>
					<IconStar
						:size="16"
						:fill="isFavorite ? 'currentcolor' : 'transparent'"
					/>
				</UButton>
			</div>
		</template>
	</UCard>
</template>
