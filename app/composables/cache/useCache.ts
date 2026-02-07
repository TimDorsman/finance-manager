export function useCache(cacheKey: string, ttl: number) {
	const fetchedAt = useState<number | null>(
		`${cacheKey}:fetchedAt`,
		() => null,
	);

	function isValid() {
		return fetchedAt.value && Date.now() - fetchedAt.value < ttl;
	}

	function invalidate() {
		fetchedAt.value = null;
	}

	function update() {
		fetchedAt.value = Date.now();
	}

	return { isValid, invalidate, update, fetchedAt };
}
