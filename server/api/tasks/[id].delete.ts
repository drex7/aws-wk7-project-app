import { executeDeleteItem } from "~/lib/clientQueries";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
		const deleteItemInput = {
			TableName: "TaskifyTask",
			Key: { id },
		};
		await executeDeleteItem(deleteItemInput);
    
    return { message: "Task deleted successfully" };
  } catch (error) {
    console.error(
      `Error deleting note with ID ${getRouterParam(event, "id")}:`,
      error
    );
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete note",
    });
  }
});
