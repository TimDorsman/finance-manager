<script setup lang="ts">
const user = useSupabaseUser();

const props = defineProps<{
	src: string | undefined;
	size?: "sm" | "md" | "lg";
}>();

const metadata = computed(
	() =>
		user.value?.user_metadata as {
			name?: string;
			email?: string;
		} | null,
);

const userInitial = computed(() => {
	if (!user.value) {
		return "";
	}

	if (metadata.value?.name) {
		return metadata.value.name.slice(0, 1).toUpperCase();
	}

	if (metadata.value?.email) {
		return metadata.value.email.slice(0, 1).toUpperCase();
	}

	return "";
});
</script>

<template>
	<UAvatar :src="props.src" :size="props.size" v-bind="$attrs">
		<div class="w-full h-full flex justify-center items-center">
			{{ userInitial }}
		</div>
	</UAvatar>
</template>
