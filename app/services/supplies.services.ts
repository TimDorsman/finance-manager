export function useSupplyService() {
	const { findAllOrderedByGroup, markOutOfStock } = useSuppliesRepository();

	function fetchSuppliesOrderedByGroup() {
		return findAllOrderedByGroup();
	}

	function markSupplyOutOfStock(supplyId: string) {
		return markOutOfStock(supplyId);
	}

	return {
		fetchSuppliesOrderedByGroup,
		markSupplyOutOfStock,
	};
}
