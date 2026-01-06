<script setup lang="ts">
import SupplyCard from "~/components/card/SupplyCard.vue";
import { useSupplyService } from "~/services/supplies.services";
import type { SupplyListItem } from "~/types/supply";

const { fetchSuppliesOrderedByGroup, markSupplyOutOfStock } =
	useSupplyService();

const supplies = ref<SupplyListItem[]>([]);

onMounted(async () => {
	console.log("Mounted!");
	const response = await fetchSuppliesOrderedByGroup();
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
					Needs restocking
				</UButton>
			</template>
		</SupplyCard>
	</div>
</template>
