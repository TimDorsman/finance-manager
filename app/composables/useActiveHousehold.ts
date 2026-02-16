export function useActiveHousehold() {
	const household = useState<Household | null>("household", () => null);

	const { data, pending, error, refresh } = useFetch<Household | null>(
		"/api/household",
	);

	watchEffect(() => {
		household.value = data.value ?? null;
	});

	return {
		household,
		pending,
		error,
		refresh,
	};
}
