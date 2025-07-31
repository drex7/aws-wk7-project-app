import { v4 as uuidv4 } from "uuid";
import { executeCreateTask } from "~/lib/clientQueries";


export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const status = true
    const newTask = {
      id: uuidv4(),
      title: body.title,
      createdAt: (new Date().getTime()).toString(),
      dueDate: (body.dueDate).toString() || null,
      status: status.toString(),
      description: body.description,
    };

		await executeCreateTask(newTask);

    return newTask;
  } catch (error) {
    console.error("Error creating note:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create note",
    });
  }
});
