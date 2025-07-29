import { PutItemCommand, DeleteItemCommand, ReturnValue, ScanCommand, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { getDynamoDBClient } from "./dynamoDBConfig";
import { handlePutItemError } from "./errorHandlers";

const dynamoDbClient = getDynamoDBClient();

export const executeHealthCheck = async () => {
  try {
    const command = new ListTablesCommand()
    const response = await dynamoDbClient.send(command);
    return response.TableNames.length > 0 ? "DynamoDB is healthy" : "DynamoDB is not healthy";
  } catch (error) {
    console.log(error);
  }
}

export const executeGetTasks = async () => {
  try {
    const command = new ScanCommand({
      TableName: "TaskifyTask",
    });
    const response = await dynamoDbClient.send(command);
    return response.Items;
  } catch (error) {
    console.log(error);
  }
}

export const executeCreateTask = async (createTaskInput) => {
  try {
    const command = new PutItemCommand({
      TableName: "TaskifyTask",
      Item: createTaskInput,
      ReturnValues: ReturnValue.ALL_OLD,
    });
    const putItemOutput = await dynamoDbClient.send(command);
    console.info("Successfully created task.");
    return putItemOutput.Attributes;
  } catch (err) {
    handlePutItemError(err);
  }
}

export const executeUpdateTask = async (updateTaskInput) => {
  // Call DynamoDB's updateItem API
  try {
    const command = new PutItemCommand({
      TableName: "TaskifyTask",
      ...updateTaskInput,
      ReturnValues: "ALL_NEW",
    });
    const putItemOutput = await dynamoDbClient.send(command);
    console.info("Successfully updated task.");
    return putItemOutput.Attributes;
  } catch (err) {
    handlePutItemError(err);
  }
};

export const executeDeleteItem = async (deleteItemInput) => {
  try {
    const command = new DeleteItemCommand(deleteItemInput);
    const deleteItemOutput = await dynamoDbClient.send(command);
    console.info("Successfully deleted item.")
  } catch (err) {
    handlePutItemError(err);
  }
}


