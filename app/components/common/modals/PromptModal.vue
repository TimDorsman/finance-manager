<script setup lang="ts">
const emit = defineEmits<{
	confirm: [];
	cancel: [];
}>();

const open = defineModel<boolean>("open", { default: false });

const props = withDefaults(
	defineProps<{
		message: string;
		confirmLabel?: string;
		cancelLabel?: string;
	}>(),
	{
		confirmLabel: "Confirm",
		cancelLabel: "Cancel",
	},
);

const onConfirm = () => {
	emit("confirm");
	open.value = false;
};

const onCancel = () => {
	emit("cancel");
	open.value = false;
};
</script>
<template>
	<UModal
		v-model:open="open"
		:dismissible="false"
		title="Confirm"
		:description="props.message"
	>
		<template #body>
			<div class="p-4 space-y-4">
				<div class="flex justify-end gap-2">
					<UButton color="neutral" variant="soft" @click="onCancel">
						{{ props.cancelLabel }}
					</UButton>
					<UButton color="error" @click="onConfirm">
						{{ props.confirmLabel }}
					</UButton>
				</div>
			</div>
		</template>
	</UModal>
</template>
