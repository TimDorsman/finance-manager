import { serverSupabaseClient } from "#supabase/server";
import { HouseholdRepository } from "~~/server/repositories/household.repository";
import { HouseholdService } from "~~/server/services/household.service";

export default defineEventHandler(async (event) => {
	const supabase = await serverSupabaseClient(event);
	const repo = new HouseholdRepository(supabase);
	const service = new HouseholdService(repo);
	return await service.getHousehold();
});
