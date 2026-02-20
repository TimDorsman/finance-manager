import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~~/shared/types/database";
import type {
	AggregationPeriod,
	TransactionQueryOptions,
	TransactionPeriodSummary,
} from "~~/shared/types/transaction";

export class TransactionRepository {
	constructor(private readonly supabase: SupabaseClient<Database>) {}

	async insert(transaction: {
		amount: number;
		date: string;
		description: string;
		categoryId: string;
		householdId: string;
		userId: string;
	}) {
		const { data, error } = await this.supabase
			.from("transactions")
			.insert([
				{
					amount: transaction.amount,
					transaction_date: transaction.date,
					category_id: transaction.categoryId,
					household_id: transaction.householdId,
					user_id: transaction.userId,
					description: transaction.description,
				},
			])
			.select()
			.single();

		if (error) {
			throw error;
		}

		return data;
	}

	async select(options?: TransactionQueryOptions) {
		let query = this.supabase
			.from("transactions")
			.select(
				`
				id,
				amount,
				description,
				categoryId:category_id,
				createdBy:user_id,
				date:transaction_date
			`,
			)
			.order("transaction_date", { ascending: false });

		if (options?.limit) {
			query = query.limit(options.limit);

			if (options?.offset) {
				query = query.range(
					options.offset,
					options.offset + options.limit - 1,
				);
			}
		}

		if (options?.categoryId) {
			query = query.eq("category_id", options.categoryId);
		}

		if (options?.dateFrom) {
			const start = options.dateFrom;

			query = query.gte("transaction_date", start);
		}

		if (options?.dateTo) {
			const end = options.dateTo;
			query = query.lt("transaction_date", end);
		}

		const { data, error } = await query;

		if (error) {
			throw error;
		}

		return data ?? [];
	}

	async deleteById(id: string): Promise<void> {
		const { error } = await this.supabase
			.from("transactions")
			.delete()
			.eq("id", id);

		if (error) {
			throw error;
		}
	}

	async sumByPeriod(
		categoryId: string,
		dateFrom: string,
		dateTo: string,
		period: AggregationPeriod,
	): Promise<TransactionPeriodSummary[]> {
		const { data, error } = await this.supabase
			.from("transactions")
			.select(
				`
				transaction_date,
				amount
			`,
			)
			.eq("category_id", categoryId)
			.gte("transaction_date", dateFrom)
			.lt("transaction_date", dateTo)
			.order("transaction_date", { ascending: true });

		if (error) {
			throw error;
		}

		const grouped = new Map<string, { total: number; count: number }>();

		for (const row of data ?? []) {
			const transactionDate = String(row.transaction_date ?? "");
			const amount = Number(row.amount ?? 0);
			const periodKey = this.toPeriodKey(transactionDate, period);

			if (!periodKey) {
				continue;
			}

			const current = grouped.get(periodKey) ?? { total: 0, count: 0 };
			current.total += amount;
			current.count += 1;

			grouped.set(periodKey, current);
		}

		return [...grouped.entries()]
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([periodKey, value]) => ({
				period: periodKey,
				total: value.total,
				count: value.count,
			}));
	}

	private toPeriodKey(
		transactionDate: string,
		period: AggregationPeriod,
	): string | null {
		const [year, month, day] = transactionDate.slice(0, 10).split("-");

		if (!year || !month || !day) {
			return null;
		}

		if (period === "day") {
			return `${year}-${month}-${day}`;
		}

		if (period === "month") {
			return `${year}-${month}-01`;
		}

		return `${year}-01-01`;
	}
}
