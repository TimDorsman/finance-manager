export function useActiveHousehold() {
	const household = useState<{
		id: string;
		name: string;
		role: string;
	} | null>("household", () => null);

	return { household };
}
