import type { SupplyListItem } from "~~/shared/types/supply";

const CACHE_TTL = 60_000; // 1 minute

export function useSupplyService() {
	const { findAllOrderedByGroup, markOutOfStock } = useSuppliesRepository();

	const cacheKey = "supplies:ordered-by-group";
	const fetchedAt = useState<number | null>(
		`${cacheKey}:fetchedAt`,
		() => null
	);

	function fetchSuppliesOrderedByGroup() {
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
			}
		);
	}

	async function markSupplyOutOfStock(supplyId: string) {
		await markOutOfStock(supplyId);

		fetchedAt.value = null;
		await refreshNuxtData(cacheKey);
	}

	return {
		fetchSuppliesOrderedByGroup,
		markSupplyOutOfStock,
	};
}
