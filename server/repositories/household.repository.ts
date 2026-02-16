import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~~/shared/types/database";

export class HouseholdRepository {
	constructor(private readonly supabase: SupabaseClient<Database>) {}

	async getCurrent() {
		const { data, error } = await this.supabase
			.from("household_members")
			.select("household:households(id, name), role")
			.single();

		if (error) {
			return null;
		}

		if (!data?.household) {
			return null;
		}

		return {
			...data.household,
			role: data.role,
		};
	}
}
