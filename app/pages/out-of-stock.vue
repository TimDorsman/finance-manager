<script setup lang="ts">
import SupplyCard from "~/components/card/SupplyCard.vue";
import { useOutOfStockSuppliesService } from "~/services/outOfStockSupplies.service";
import type { SupplyListItem } from "~/types/supply";

const { fetchOutOfStockSuppliesOrderedByGroup, markOutOfStockSupply } =
	useOutOfStockSuppliesService();

const supplies = ref<SupplyListItem[]>([]);

onMounted(async () => {
	const response = await fetchOutOfStockSuppliesOrderedByGroup();

	console.log({ response });
	supplies.value = response;
	console.log({ supplies });
});
</script>
<template>
	<IconLoader
		class="mx-auto mb-4 animate-spin duration-4000"
		:size="48"
		v-if="supplies.length === 0"
	/>
	<div v-else class="w-fit mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
		<SupplyCard
			v-for="supply in supplies"
			:key="supply.id"
			:name="supply.name"
			:image="supply.image"
			:id="supply.id"
		>
			<template #buttons>
				<UButton
					variant="outline"
					size="sm"
					color="error"
					class="cursor-pointer"
					@click="markOutOfStockSupply(supply.id)"
				>
					Restocked
				</UButton>
			</template>
		</SupplyCard>
	</div>
</template>
