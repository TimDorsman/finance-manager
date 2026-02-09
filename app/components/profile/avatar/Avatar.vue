<script setup lang="ts">
const user = useSupabaseUser();

const props = defineProps<{
	src?: string;
	size?: "sm" | "md" | "lg";
}>();

const getInitialOfUser = computed(() => {
	if (!user.value) {
		return "";
	}

	if (user.value?.user_metadata?.name) {
		return user.value?.user_metadata.name.slice(0, 1).toUpperCase();
	}

	if (user.value?.user_metadata?.email) {
		return user.value?.user_metadata.email.slice(0, 1).toUpperCase();
	}

	return "";
});
</script>

<template>
	<UAvatar :src="src" :size="size" v-bind="$attrs">
		<div class="w-full h-full flex justify-center items-center">
			{{ getInitialOfUser }}
		</div>
	</UAvatar>
</template>
