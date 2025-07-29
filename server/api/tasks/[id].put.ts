// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { executeUpdateTask } from "~/lib/clientQueries";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);

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
    if (body.isCompleted !== undefined) {
      updateExpressions.push("#ic = :isCompleted");
      expressionAttributeValues[":isCompleted"] = body.isCompleted;
      expressionAttributeNames["#ic"] = "isCompleted";
    }

    if (updateExpressions.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "No fields to update",
      });
    }

    updateExpressionString += updateExpressions.join(", ");

    const response = await executeUpdateTask({
      Key: { id },
      UpdateExpression: updateExpressionString,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
    });
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
