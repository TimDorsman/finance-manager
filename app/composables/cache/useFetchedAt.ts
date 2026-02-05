export function useFetchedAt(key: string) {
	return useState<number | null>(`${key}:fetchedAt`, () => null);
}
