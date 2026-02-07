export class TextTransformer {
	static camelToTitle(text: string) {
		const string = text
			.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
			.toLowerCase()
			.trim();
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
}
