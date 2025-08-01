export default defineEventHandler(async (event) => {
  
  return {
    status: "ok",
    statusCode: 200,
    statusMessage: "Health check passed",
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime(),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || "development",
  };
});
