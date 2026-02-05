import type { SupplyListItem } from "~~/shared/types/supply";

const CACHE_TTL = 60_000; // 1 minute

const supplyCacheKeys = {
	orderedByGroup: () => "supplies:ordered-by-group",
};

export function useSupplyService() {
	const { findAllOrderedByGroup, markOutOfStock } = useSuppliesRepository();

	function fetchSuppliesOrderedByGroup() {
		const cacheKey = supplyCacheKeys.orderedByGroup();
		const fetchedAt = useFetchedAt(cacheKey);

		return useAsyncData<SupplyListItem[]>(
			cacheKey,
			async () => {
				const data = await findAllOrderedByGroup();
				fetchedAt.value = Date.now();
				return data;
			},
			{
				default: () => [],
				getCachedData(key, nuxtApp) {
					if (!fetchedAt.value) return;

					const isExpired = Date.now() - fetchedAt.value > CACHE_TTL;
					if (isExpired) return;

					return nuxtApp.payload.data[key];
				},
			},
		);
	}

	async function markSupplyOutOfStock(supplyId: string) {
		const result = await markOutOfStock(supplyId);

		if (result) {
			const cacheKey = supplyCacheKeys.orderedByGroup();
			useFetchedAt(cacheKey).value = null;
			await refreshNuxtData(cacheKey);
		}

		return result;
	}

	return {
		fetchSuppliesOrderedByGroup,
		markSupplyOutOfStock,
	};
}
