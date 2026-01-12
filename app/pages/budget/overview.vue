<script setup lang="ts">
const { household } = useActiveHousehold();
const { loadHousehold } = useHouseholdService();
const isMounted = ref(false);

onMounted(async () => {
	await loadHousehold();
	isMounted.value = true;
});
</script>
<template>
	<h2
		class="text-2xl md:text-4xl font-semibold tracking-tight text-primary mb-16"
	>
		Household
		<span class="font-bold text-secondary dark:text-white">{{
			household?.name
		}}</span>
	</h2>

	<div>
		<div
			class="flex flex-col md:flex-row items-start md:items-center justify-between gap-y-4 md:gap-0"
		>
			<h3
				class="text-xl font-medium text-secondary dark:text-white w-fit pb-2 border-b-2 border-secondary dark:border-white"
			>
				Your budget categories
			</h3>
			<UButton
				variant="soft"
				color="primary"
				class="cursor-pointer"
				icon="i-lucide-circle-plus"
				@click="navigateTo('/budget/category/create')"
			>
				Create new category
			</UButton>
		</div>
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
			<div
				v-for="category in [
					'Groceries',
					'Utilities',
					'Transport',
					'Entertainment',
				]"
				:key="category"
				class="mt-6 p-4 bg-default/70 backdrop-blur border border-default rounded-lg shadow-sm"
			>
				<p class="text-lg font-medium text-primary">{{ category }}</p>
				<p class="mt-2 text-gray-600 dark:text-gray-300">
					Budgeted: $500
				</p>
				<p class="text-gray-600 dark:text-gray-300">Spent: $350</p>
				<BarChart v-if="isMounted" />
				<IconLoader
					class="mx-auto mb-4 animate-spin duration-4000"
					:size="48"
					v-else
				/>
			</div>
		</div>
	</div>
</template>
