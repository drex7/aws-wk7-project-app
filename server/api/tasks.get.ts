import { executeGetTasks } from "~/lib/clientQueries";

export default defineEventHandler(async (event) => {
  try {
    const response = await executeGetTasks();
    return response;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch tasks",
    });
  }
});
