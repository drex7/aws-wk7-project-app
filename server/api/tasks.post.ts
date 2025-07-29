import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { executeCreateTask } from "~/lib/clientQueries";


export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const newTask = {
      id: uuidv4(),
      title: body.title,
      createdAt: new Date().toISOString(),
      dueDate: body.dueDate || null,
      isCompleted: body.isCompleted || false,
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
