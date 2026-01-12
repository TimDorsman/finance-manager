export function useHouseholdService() {
	const { household } = useActiveHousehold();
	const { fetchHousehold } = useHouseholdRepository();

	async function loadHousehold() {
		if (!household.value) {
			household.value = await fetchHousehold();
		}
	}

	return {
		loadHousehold,
	};
}
