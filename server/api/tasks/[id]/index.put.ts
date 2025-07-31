import { executeUpdateTask } from "~/lib/clientQueries";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    console.log("index.put.ts: body", body);
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "ID parameter is required",
      });
    }
    body.id = id;
    body.status = body.status.toString()
    /*
    const updateExpressions: string[] = [];
    const expressionAttributeValues: Record<string, any> = {};
    const expressionAttributeNames: Record<string, string> = {};
    let updateExpressionString = "SET ";

    if (body.title !== undefined) {
      updateExpressions.push("#t = :title");
      expressionAttributeValues[":title"] = body.title;
      expressionAttributeNames["#t"] = "title";
    }
    if (body.dueDate !== undefined) {
      updateExpressions.push("#dd = :dueDate");
      expressionAttributeValues[":dueDate"] = body.dueDate;
      expressionAttributeNames["#dd"] = "dueDate";
    }
    if (body.status !== undefined) {
      updateExpressions.push("#ic = :status");
      expressionAttributeValues[":status"] = body.status;
      expressionAttributeNames["#ic"] = "status";
    }
    if (body.createdAt !== undefined) {
      updateExpressions.push("#ic = :createdAt");
      expressionAttributeValues[":createdAt"] = body.createdAt;
      expressionAttributeNames["#ic"] = "createdAt";
    }

    if (updateExpressions.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "No fields to update",
      });
    }
    updateExpressionString += updateExpressions.join(", ");
    */

    const response = await executeUpdateTask(body);
    return response?.Attributes;
  } catch (error) {
    console.error(
      `Error updating note with ID ${getRouterParam(event, "id")}:`,
      error
    );
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update note",
    });
  }
});
