import { serverSupabaseClient } from "#supabase/server";
import { HouseholdRepository } from "~~/server/repositories/household.repository";
import { HouseholdService } from "~~/server/services/household.service";
import { authenticateUser } from "~~/server/utils/authenticateUser";

export default defineEventHandler(async (event) => {
	const user = await authenticateUser(event);

	const supabase = await serverSupabaseClient(event);
	const repo = new HouseholdRepository(supabase);
	const service = new HouseholdService(repo);

	const cachedGetHousehold = defineCachedFunction(
		async () => {
			return service.getHousehold();
		},
		{
			maxAge: 3600,
			name: "getHousehold",
			getKey: () => `household_${user?.sub}`,
		},
	);

	return await cachedGetHousehold();
});
