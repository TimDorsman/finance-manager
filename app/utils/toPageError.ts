export function toPageError(
	error: unknown,
	fallbackStatusCode = 500,
	fallbackStatusMessage = "Something went wrong",
) {
	const appError = error as {
		statusCode?: number;
		statusMessage?: string;
		message?: string;
	};

	return createError({
		statusCode: appError?.statusCode ?? fallbackStatusCode,
		statusMessage:
			appError?.statusMessage ??
			appError?.message ??
			fallbackStatusMessage,
	});
}
