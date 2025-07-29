import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

function getDynamoDBClient() {
  let dynamoDBClient: DynamoDBClient;

  // if (!config) {
  //   throw new Error("Configuration is required to create DynamoDB client");
  // }
  // if (process.env.NODE_ENV != "production") {
  //   console.log("Creating DynamoDB client in non-production environment");

    dynamoDBClient = new DynamoDBClient({
      region: process.env.AWS_REGION,
      endpoint: process.env.AWS_DYNAMODB_ENDPOINT,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  // } else {
  //   console.log("Creating DynamoDB client in production environment");

  //   dynamoDBClient = new DynamoDBClient({
  //     region: process.env.AWS_REGION,
  //     endpoint: process.env.AWS_DYNAMODB_ENDPOINT,
  //     credentials: {
  //       accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  //     },
  //   });
  // }
	
  return dynamoDBClient;
}

export { getDynamoDBClient };
