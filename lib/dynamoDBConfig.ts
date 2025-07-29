import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

function getDynamoDBClient() {

  let client;


  if (process.env.NODE_ENV != "production") {
    console.log("Creating DynamoDB client in non-production environment");

    client = new DynamoDBClient({
      region: process.env.AWS_REGION,
      ...(process.env.NODE_ENV !== "production" && {
        endpoint: process.env.AWS_DYNAMODB_ENDPOINT,
      }),
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    
  } else {
    console.log("Creating DynamoDB client in production environment");

    client = new DynamoDBClient({
      region: process.env.AWS_REGION,
    });
  }

  return DynamoDBDocumentClient.from(client);
}

export { getDynamoDBClient };
