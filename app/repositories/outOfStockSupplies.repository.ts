import type { Database } from "~~/shared/types/database";
import type { SupplyListItem } from "~~/shared/types/supply";

export function useOutOfStockRepository() {
	const supabase = useSupabaseClient<Database>();

	const fetchAll = async (): Promise<SupplyListItem[]> => {
		const { data, error } = await supabase.from("out_of_stock_supplies")
			.select(`
					supplies (
					id,
					name,
					image
					)
				`);

		if (error) {
			throw error;
		}
		return (data ?? []).map((item) => ({
			id: item.supplies.id,
			name: item.supplies.name,
			image: item.supplies.image ?? "",
		}));
	};

	const remove = async (supplyId: string): Promise<void> => {
		const { error } = await supabase
			.from("out_of_stock_supplies")
			.delete()
			.eq("supply_id", supplyId);

		if (error) {
			throw error;
		}
	};

	return {
		fetchAll,
		remove,
	};
}
