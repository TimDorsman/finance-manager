// server/repositories/transaction.repository.ts

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~~/shared/types/database";

export type TransactionQueryOptions = {
	categoryId?: string;
	month?: string; // format: YYYY-MM-01
};

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

		if (options?.categoryId) {
			query = query.eq("category_id", options.categoryId);
		}

		if (options?.month) {
			const start = options.month;
			const end = getNextMonth(start);

			query = query
				.gte("transaction_date", start)
				.lt("transaction_date", end);
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
}
