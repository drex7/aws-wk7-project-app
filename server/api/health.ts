import { executeHealthCheck } from "~/lib/clientQueries";

export default defineEventHandler(async (event) => {
  const result = await executeHealthCheck();
  if (result === false) {
    throw createError({
      statusCode: 500,
      statusMessage: "Health check failed",
    });
  }
  return {
    status: "ok",
    statusMessage: "Health check passed",
    timestamp: new Date().toISOString(),
  };
});
