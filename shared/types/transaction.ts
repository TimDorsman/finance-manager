export type Transaction = {
	id: string;
	categoryId: string;
	amount: number;
	date: string;
	createdBy: string;
	description: string | null;
};

export type TransactionQueryOptions = {
	categoryId?: string;
	dateFrom?: string;
	dateTo?: string;
	limit?: number;
	offset?: number;
};

export type AggregationPeriod = "day" | "month" | "year";

export type PeriodSumRow = {
	period: string; // date_trunc returns timestamp
	total: string; // numeric aggregate comes back as string
};

export type TransactionPeriodSummary = {
	period: string;
	total: number;
	count: number;
};
