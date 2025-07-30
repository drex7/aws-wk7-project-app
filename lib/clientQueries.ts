import { ReturnValue, DescribeTableCommand } from "@aws-sdk/client-dynamodb";
import { getDynamoDBClient } from "./dynamoDBConfig";
import { handlePutItemError } from "./errorHandlers";
import { ScanCommand, PutCommand, DeleteCommand  } from "@aws-sdk/lib-dynamodb";

const dynamoDbClient = getDynamoDBClient();
const tableName = "TaskifyTask";

export const executeHealthCheck = async () => {
  try {
    const command = new DescribeTableCommand({
      TableName: tableName,
    });
    const response = await dynamoDbClient.send(command);
    console.log(
      `Table '${tableName}' exists. Status: ${response.Table.TableStatus}`
    );
    // return `Table '${tableName}' exists. Status: ${response.Table.TableStatus}`;
    return true;
  } catch (error) {
    if (error.name === "ResourceNotFoundException") {
      console.log(`Table '${tableName}' does not exist.`);
      return false;
    } else {
      // Re-throw other unexpected errors
      console.error(`An unexpected error occurred: ${error.message}`);
      throw error;
    }
  }
}

export const executeGetTasks = async () => {
  try {
    const command = new ScanCommand({
      TableName: tableName,
    });
    const response = await dynamoDbClient.send(command);
    return response.Items;
  } catch (error) {
    console.log(error);
  }
}

export const executeCreateTask = async (newTask) => {
  try {
    const command = new PutCommand({
      TableName: tableName,
      Item: newTask,
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
    const command = new PutCommand({
      TableName: tableName,
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
    const command = new DeleteCommand(deleteItemInput);
    const deleteItemOutput = await dynamoDbClient.send(command);
    console.info("Successfully deleted item.")
  } catch (err) {
    handlePutItemError(err);
  }
}


