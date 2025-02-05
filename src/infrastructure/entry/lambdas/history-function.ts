import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { DynamoDBFilmRepository } from "../../repositories/DynamoDBFilmRepository";
import { AllFilm } from "../../../usecases/AllFilm";

const dynamoClient: DynamoDB = new DynamoDB();
const FILM_TABLE: string = process.env.FILM_TABLE || '';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const repository = new DynamoDBFilmRepository(dynamoClient, FILM_TABLE);
  const allFim = new AllFilm(repository);

  try {
    const films = await allFim.execute();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Ok',
        data: films.items
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'There was an internal error'
      })
    }
  }
}
