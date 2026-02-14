export function useSupplyService() {
	const { findAllOrderedByGroup, markOutOfStock } = useSuppliesRepository();

	async function fetchSuppliesOrderedByGroup() {
		return await findAllOrderedByGroup();
	}

	async function markSupplyOutOfStock(supplyId: string) {
		if (!supplyId) {
			throw new Error("Supply ID is required");
		}

		return await markOutOfStock(supplyId);
	}

	return {
		fetchSuppliesOrderedByGroup,
		markSupplyOutOfStock,
	};
}
