export function getNextMonth(month: string): string {
	const date = new Date(month);
	date.setMonth(date.getMonth() + 1);
	return date.toISOString().slice(0, 10);
}
