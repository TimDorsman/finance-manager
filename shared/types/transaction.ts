export type Transaction = {
	id: string;
	categoryId: string;
	amount: number;
	date: string;
	createdBy: string;
	description: string | null;
};
