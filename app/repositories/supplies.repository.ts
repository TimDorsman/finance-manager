import type { Database } from "~/types/supabase";
import type { SupplyListItem } from "~/types/supply";

export const useSuppliesRepository = () => {
	const supabase = useSupabaseClient<Database>();

	const findAllOrderedByGroup = async (): Promise<SupplyListItem[]> => {
		const { data, error } = await supabase
			.from("supplies")
			.select(
				`
				id,
				name,
				image,
				supply_groups (
					id,
					name
				)
			`
			)
			.order("name", {
				foreignTable: "supply_groups",
				ascending: true,
				nullsFirst: false,
			})
			.order("name", { ascending: true });

		if (error) {
			throw error;
		}
		return (data ?? []).map((item) => ({
			...item,
			image: item.image ?? "",
		}));
	};

	const markOutOfStock = async (supplyId: string): Promise<void> => {
		const { error } = await supabase
			.from("out_of_stock_supplies")
			.insert({ supply_id: supplyId });

		if (error) {
			throw error;
		}
	};

	return {
		findAllOrderedByGroup,
		markOutOfStock,
	};
};
