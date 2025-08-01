import { executeDBHealthCheck } from "~/lib/clientQueries";

export default defineEventHandler(async (event) => {
	const result = await executeDBHealthCheck();
	if (result === false) {
		throw createError({
			statusCode: 500,
			statusMessage: "Health check failed",
		});
	}
	return {
		status: "ok",
		statusCode: 200,
		statusMessage: "Health check passed",
		timestamp: new Date().toISOString(),
	};
});
