export function useOutOfStockSuppliesService() {
	const { fetchAll, remove } = useOutOfStockRepository();

	function fetchOutOfStockSuppliesOrderedByGroup() {
		return fetchAll();
	}

	function markOutOfStockSupply(supplyId: string) {
		return remove(supplyId);
	}

	return {
		fetchOutOfStockSuppliesOrderedByGroup,
		markOutOfStockSupply,
	};
}
