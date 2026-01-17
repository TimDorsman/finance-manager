export type Transaction = {
	id: string;
	categoryId: string;
	amount: number;
	date: Date;
	createdBy: string;
	description: string | null;
};
