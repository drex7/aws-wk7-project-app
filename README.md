# Fullstack Gallery App with NuxtJs (with Prisma/Postgres DB)

This app implement a **fullstack app with [Nuxt](https://nuxtjs.org//)** using [Vue](https://vuejs.org/) (frontend) and **Prisma Client** with AWS RDS Pstgres DB.

## Getting started

### 1. Download example and navigate into the project directory

Clone this repository:

```
git clone repo-url
```

Install npm dependencies:

```
yarn install
```

### 3. Build for production

```
npm run build
```

Build the docker image (local dev)

```
docker build -t gallery-app --build-arg DOCKER_ENV=dev --secret id=aws,src=./.env  .
```

Run the docker image (local dev)

```
docker run  --name gallery-app -e NODE_ENV=dev  -p 3000:3000 --rm -it test-node ash
```

The app is now running, navigate to [`http://localhost:3000/`](http://localhost:3000/) in your browser to explore its UI.

### Validate docker compose file

```
docker compose config --quiet && printf "OK\n" || printf "ERROR\n"
```

```js
// ------------ NodeJS runtime ---------------
// Add @aws-sdk/client-dynamodb in package.json as a dependency
// Example:
// {
//     "dependencies": {
//         "@aws-sdk/client-dynamodb": "^3.496.0",
//     }
// }
// Create your credentials file at ~/.aws/credentials (C:\Users\USER_NAME\.aws\credentials for Windows users)
// Format of the above file should be:
//  [default]
//  aws_access_key_id = YOUR_ACCESS_KEY_ID
//  aws_secret_access_key = YOUR_SECRET_ACCESS_KEY

const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");

// Create the DynamoDB Client with the region you want
const region = "us-east-1";
const dynamoDbClient = createDynamoDbClient(region);

// Create the input for scan call
const scanInput = createScanInput();

// Call DynamoDB's scan API
executeScan(dynamoDbClient, scanInput).then(() => {
  console.info("Scan API call has been executed.");
});

function createDynamoDbClient(regionName) {
  return new DynamoDBClient({ region: regionName });
  // Use the following config instead when using DynamoDB local
  // return new DynamoDBClient({ region: 'localhost', endpoint: 'http://localhost:8000', credentials: { accessKeyId: 'access_key_id', secretAccessKey: 'secret_access_key' } });
}

function createScanInput() {
  return {
    TableName: "CustomerBookmark",
    ConsistentRead: false,
    FilterExpression: "#eabb0 <> :eabb0",
    ExpressionAttributeValues: {
      ":eabb0": {
        S: "321",
      },
    },
    ExpressionAttributeNames: {
      "#eabb0": "customerId",
    },
  };
}

async function executeScan(dynamoDbClient, scanInput) {
  // Call DynamoDB's scan API
  try {
    const command = new ScanCommand(scanInput);
    const scanOutput = await dynamoDbClient.send(command);
    console.info("Scan successful.");
    // Handle scanOutput
  } catch (err) {
    handleScanError(err);
  }
}

// Handles errors during Scan execution. Use recommendations in error messages below to
// add error handling specific to your application use-case.
function handleScanError(err) {
  if (!err) {
    console.error("Encountered error object was empty");
    return;
  }
  if (!err.name) {
    console.error(
      `An exception occurred, investigate and configure retry strategy. Error: ${JSON.stringify(err)}`
    );
    return;
  }
  // here are no API specific errors to handle for Scan, common DynamoDB API errors are handled below
  handleCommonErrors(err);
}

function handleCommonErrors(err) {
  switch (err.name) {
    case "InternalServerError":
      console.error(
        `Internal Server Error, generally safe to retry with exponential back-off. Error: ${err.message}`
      );
      return;
    case "ProvisionedThroughputExceededException":
      console.error(
        `Request rate is too high. If you're using a custom retry strategy make sure to retry with exponential back-off. ` +
          `Otherwise consider reducing frequency of requests or increasing provisioned capacity for your table or secondary index. Error: ${err.message}`
      );
      return;
    case "ResourceNotFoundException":
      console.error(
        `One of the tables was not found, verify table exists before retrying. Error: ${err.message}`
      );
      return;
    case "ServiceUnavailable":
      console.error(
        `Had trouble reaching DynamoDB. generally safe to retry with exponential back-off. Error: ${err.message}`
      );
      return;
    case "ThrottlingException":
      console.error(
        `Request denied due to throttling, generally safe to retry with exponential back-off. Error: ${err.message}`
      );
      return;
    case "UnrecognizedClientException":
      console.error(
        `The request signature is incorrect most likely due to an invalid AWS access key ID or secret key, fix before retrying. ` +
          `Error: ${err.message}`
      );
      return;
    case "ValidationException":
      console.error(
        `The input fails to satisfy the constraints specified by DynamoDB, ` +
          `fix input before retrying. Error: ${err.message}`
      );
      return;
    case "RequestLimitExceeded":
      console.error(
        `Throughput exceeds the current throughput limit for your account, ` +
          `increase account level throughput before retrying. Error: ${err.message}`
      );
      return;
    default:
      console.error(
        `An exception occurred, investigate and configure retry strategy. Error: ${err.message}`
      );
      return;
  }
}
```
