<script setup lang="ts">
import { useOutOfStockSuppliesService } from "~/services/outOfStockSupplies.service";
import type { SupplyListItem } from "~/types/supply";

const { fetchOutOfStockSuppliesOrderedByGroup, markOutOfStockSupply } =
	useOutOfStockSuppliesService();

const supplies = ref<SupplyListItem[] | null>(null);

onMounted(async () => {
	const response = await fetchOutOfStockSuppliesOrderedByGroup();
	supplies.value = response;
});

let channel: any | null = null;

const handleChange = async (event: any) => {
	console.log(event.new);
	const response = await fetchOutOfStockSuppliesOrderedByGroup();
	supplies.value = response;
};

onMounted(async () => {
	const supabase = useSupabaseClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return;

	channel = supabase
		.channel(`user:${user.id}`)
		.on(
			"postgres_changes",
			{
				event: "*",
				schema: "public",
				table: "out_of_stock_supplies",
			},
			handleChange
		)
		.subscribe();
});

onBeforeUnmount(() => {
	const supabase = useSupabaseClient();
	if (channel) {
		supabase.removeChannel(channel);
		channel = null;
	}
});
</script>
<template>
	<div class="h-full w-full flex items-center justify-center">
		<IconLoader
			class="mx-auto mb-4 animate-spin duration-4000"
			:size="48"
			v-if="supplies === null"
		/>
		<div
			v-else-if="supplies.length === 0"
			class="flex flex-col items-center gap-4"
		>
			<UEmpty
				icon="i-lucide-check-circle-2"
				title="All supplies are in stock"
				description="There are no supplies out of stock at the moment."
				:actions="[
					{
						label: 'Go to catalog',
						icon: 'i-lucide-arrow-left',
						to: '/catalog',
					},
				]"
			/>
		</div>

		<template v-else>
			<div class="w-fit mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
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
	</div>
</template>
