import type { Database } from "./database";

export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

export type Category = {
	id: string;
	name: string;
	scope: string;
	ownerUserId: string | null;
	isArchived: boolean;
	householdId: string;
	createdAt: Date;
};

export type CategoryView = Category & {
	isPersonal: boolean;
};
