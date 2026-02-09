<script setup lang="ts">
import { useSupplyService } from "~/services/supplies.service";

const { fetchSuppliesOrderedByGroup, markSupplyOutOfStock } =
	useSupplyService();

const supplies = ref<Map<string, SupplyListItemByGroup[]>>(new Map());

onMounted(async () => {
	const { data } = await fetchSuppliesOrderedByGroup();
	const response = (data.value ?? []) as SupplyListItemByGroup[];

	const mappedSupplies = new Map<string, SupplyListItemByGroup[]>();
	response.forEach((supply: SupplyListItemByGroup) => {
		const groupName = supply.supply_groups.name;
		if (!mappedSupplies.has(groupName)) {
			mappedSupplies.set(groupName, []);
		}
		mappedSupplies.get(groupName)!.push(supply);
	});

	supplies.value = mappedSupplies;
});

const suppliesByGroup = computed(() => Array.from(supplies.value));
const isLoading = computed(() => supplies.value.size === 0);
</script>
<template>
	<div class="h-full w-full flex items-center justify-center">
		<IconLoader
			class="mx-auto mb-4 animate-spin duration-4000"
			:size="48"
			v-if="isLoading"
		/>

		<div v-else class="w-fit mx-auto grid gap-4">
			<div
				v-for="[groupName, supplyGroup] in suppliesByGroup"
				:key="groupName"
				class="flex flex-col gap-1 items-start justify-start"
			>
				<HighlightedLabel
					:color="supplyGroup?.[0]?.supply_groups?.color ?? '#000'"
				>
					{{ groupName }}
				</HighlightedLabel>
				<div
					class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-auto"
				>
					<SupplyCard
						v-for="supply in supplyGroup"
						:key="supply.id"
						:name="supply.name"
						:image="supply.image"
						:id="supply.id"
						:hasFavorite="true"
					>
						<template #buttons>
							<UButton
								variant="outline"
								size="sm"
								class="cursor-pointer"
								@click="markSupplyOutOfStock(supply.id)"
							>
								<IconPlus :size="16" class="mr-1" />
								Add to restock
							</UButton>
						</template>
					</SupplyCard>
				</div>
			</div>
		</div>
	</div>
</template>
