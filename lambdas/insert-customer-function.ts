import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { v4 as uuidV4 } from 'uuid';
import { IUser } from "./types";

const USER_TABLE: string = process.env.USER_TABLE || '';
const dynamoDB: DynamoDB = new DynamoDB();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const body = event.body ? JSON.parse(event.body) : {};

  const { name, lastName, email } = body;

  if (!name || !lastName || !email) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'name, lastName and email are required fields',
      }),
    };
  }

  const data: IUser = {
    name,
    lastName,
    email,
    confirmed: false
  }

  let id = null;

  try {
    id = await storeUser(data);
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'There was an internal error',
      }),
    };
  }

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'OK',
      id
    })
  };
}

async function storeUser(data: any) {
  const id = uuidV4();

  console.log('USER ID', id);

  const params = {
    TableName: USER_TABLE,
    Item: {
      id,
      ...data,
      timestamp: Date.now()
    },
  };

  try {
    await dynamoDB.send(
      new PutCommand(params)
    );
  } catch (error) {
    console.error('Error al almacenar en User:', error);
  }

  return id;
}
