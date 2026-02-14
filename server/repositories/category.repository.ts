import type { SupabaseClient, PostgrestError } from "@supabase/supabase-js";
import type { Database } from "~~/shared/types/database";

export class CategoryRepository {
	constructor(private readonly supabase: SupabaseClient<Database>) {}

	async insert(
		name: string,
		scope: Scope,
		householdId: string,
	): Promise<PostgrestError | void> {
		const { error } = await this.supabase
			.from("categories")
			.insert([{ name, scope, household_id: householdId }]);

		if (error) {
			throw error;
		}
	}

	async select() {
		const { data, error } = await this.supabase.from("categories").select(`
			id,
			name,
			scope,
			ownerUserId:owner_user_id,
			householdId:household_id,
			isArchived:is_archived,
			createdAt:created_at
		`);

		if (error) {
			throw error;
		}

		return data ?? [];
	}

	async selectById(id: string) {
		const { data, error } = await this.supabase
			.from("categories")
			.select(
				`
				id,
				name,
				scope,
				ownerUserId:owner_user_id,
				householdId:household_id,
				isArchived:is_archived,
				createdAt:created_at
			`,
			)
			.eq("id", id)
			.single();

		if (error) {
			throw error;
		}

		return data;
	}

	async delete(id: string): Promise<void> {
		const { error } = await this.supabase
			.from("categories")
			.delete()
			.eq("id", id);

		if (error) {
			throw error;
		}
	}
}
