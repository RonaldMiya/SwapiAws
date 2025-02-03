import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const FILM_TABLE: string = process.env.FILM_TABLE || '';
const dynamoDB: DynamoDB = new DynamoDB();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const params = {
    TableName: FILM_TABLE
  }

  let filmList: unknown[] = [];

  try {
    const result = await dynamoDB.send(
      new ScanCommand(params)
    );

    if (result.Items) {
      filmList = result.Items;
    }
  } catch (error) {
    return  {
      statusCode: 200,
      body: JSON.stringify({
        message: 'There was an internal error'
      })
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: filmList
    })
  };
}
