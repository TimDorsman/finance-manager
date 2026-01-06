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
	<UCard :key="id">
		<template #header>
			<span>{{ $props.name }}</span>
		</template>

		<img
			v-if="image"
			:src="image"
			:alt="`Image of ${$props.name}`"
			class="max-w-48"
		/>
		<template #footer>
			<div class="flex align-center justify-between">
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
