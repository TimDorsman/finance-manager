import type { Database } from "./database";

export type SupplyRow = Database["public"]["Tables"]["supplies"]["Row"];

export type SupplyListItem = Pick<SupplyRow, "id" | "name" | "image">;

export type SupplyListItemByGroup = SupplyListItem & {
	supply_groups: {
		name: string;
		color: string;
	};
};

export type SuppliesByGroup = {
	[groupName: string]: SupplyListItemByGroup[];
};
