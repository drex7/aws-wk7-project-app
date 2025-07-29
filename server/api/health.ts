import { executeHealthCheck } from "~/lib/clientQueries";

export default defineEventHandler(async (event) => {
  const result = await executeHealthCheck();

  return {
    status: "ok",
    message: result,
    timestamp: new Date().toISOString(),
    result: result,
  };
});
