import { DescribeTableCommand, ReturnValue } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, PutCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { getDynamoDBClient } from "./dynamoDBConfig";
import { handlePutItemError } from "./errorHandlers";

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
    return true;
  } catch (error) {
    if (error.name === "ResourceNotFoundException") {
      console.log(`Table '${tableName}' does not exist.`);
      return false;
    } else {
      // Re-throw other unexpected errors
      console.error(`An unexpected error occurred: ${error}`);
      throw error;
    }
  }
};

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
};

export const executeCreateTask = async (newTask) => {
  try {
    console.log("\n\n\n ====== newTask: ", newTask, "\n\n\n");
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
};

export const executeUpdateTask = async (updateTaskInput) => {
  // Call DynamoDB's updateItem API
  try {
    console.log("=========> updateTaskInput", updateTaskInput);
    const command = new UpdateCommand({
      TableName: tableName,
      Key: { 
        id: updateTaskInput.id, 
        createdAt: updateTaskInput.createdAt 
      },
      UpdateExpression: "set #title = :v_title, #dueDate = :v_dueDate, #status = :v_status",
      ExpressionAttributeNames: {
        "#title": "title",
        "#dueDate": "dueDate",
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":v_title": updateTaskInput.title,
        ":v_dueDate": updateTaskInput.dueDate,
        ":v_status": updateTaskInput.status,
      },
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
    console.info("Successfully deleted item.");
  } catch (err) {
    handlePutItemError(err);
  }
};
