import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { KMSClient } from "@aws-sdk/client-kms";
import { DynamoDB } from "@aws-sdk/client-dynamodb";

import { DynamoDBUserRepository } from "../../repositories/DynamoDBCustomerRepository";
import { CreateUser } from "../../../usecases/CreateUser";
import { KMSHashService } from "../../services/KMSHashService";

const KMS_KEY_ID: string = process.env.KMS_KEY_ID || '';
const USER_TABLE: string = process.env.USER_TABLE || '';

const kmsClient: KMSClient = new KMSClient();
const dynamoClient: DynamoDB = new DynamoDB();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const body = event.body ? JSON.parse(event.body) : {};

  const { name, lastName, email, password } = body;

  if (!name || !lastName || !email || !password) {
    return {
      statusCode: 422,
      body: JSON.stringify({
        message: 'name, lastName, email and password are required fields',
      }),
    };
  }

  const repository = new DynamoDBUserRepository(dynamoClient, USER_TABLE);
  const service = new KMSHashService(kmsClient, KMS_KEY_ID);
  const createUser = new CreateUser(repository, service);

  try {
    const user = await createUser.execute({
      name,
      lastName,
      email,
      password
    });

    const data = convertToJson(user);

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'OK',
        data,
      })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'There was an exception'
      })
    }
  }
}

function convertToJson(user: any) {
  return {
    id: user.id,
    name: user.name,
    lastName: user.lastName,
    email: user.email,
    confirmed: user.confirmed
  }
}
