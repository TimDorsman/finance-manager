const { data, pending, error, refresh } = useFetch<Household | null>(
	"/api/household",
	{
		key: "active-household",
	},
);

const household = useState<Household | null>("household", () => null);

watchEffect(() => {
	household.value = data.value ?? null;
});

export function useActiveHousehold() {
	return {
		household: readonly(household),
		pending,
		error,
		refresh,
	};
}
