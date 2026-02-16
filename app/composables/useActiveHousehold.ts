export function useActiveHousehold() {
	const household = useState<{
		id: string;
		name: string;
		role: string;
	} | null>("household", () => null);

	async function fetchHousehold() {
		const data = await $fetch("/api/household");
		household.value = data;
	}

	return { household, fetchHousehold };
}
