import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { CreateFilm } from "../../../usecases/CreateFilm";
import { FetchSwapi } from "../../../usecases/FetchSwapi";
import { AxiosSwapiService } from "../../services/AxiosSwapiService";
import { DynamoDBCacheService } from "../../services/DynamoDBCacheService";
import { DynamoDBFilmRepository } from "../../repositories/DynamoDBFilmRepository";

const FILM_TABLE: string = process.env.FILM_TABLE || '';
const CACHE_TABLE: string = process.env.CACHE_TABLE || '';

const IMDBAPI: string = process.env.IMDBAPI || '';
const SWAPIAPI: string = process.env.SWAPIAPI || '';

const dynamoClient: DynamoDB = new DynamoDB();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id: string | undefined = event.pathParameters?.id

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'You must pass an ID Film from SWAPI API as parameter' })
    }
  }

  const cacheService = new DynamoDBCacheService(dynamoClient, CACHE_TABLE);
  const httpService = new AxiosSwapiService(SWAPIAPI, IMDBAPI);
  const fetchApi = new FetchSwapi(cacheService, httpService);

  const data = await fetchApi.execute(id);

  if (!data) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: `Cannot found an item with ID ${id}`
      })
    };
  }

  const repositoryFilm = new DynamoDBFilmRepository(dynamoClient, FILM_TABLE);
  const createFilm = new CreateFilm(repositoryFilm);

  try {
    await createFilm.execute({
      title: data.title,
      episodeId: data.episodeId,
      openingCrawl: data.openingCrawl,
      director: data.director,
      producer: data.producer,
      releaseDate: data.releaseDate,
      fullName: data.fullName,
      releaseYear: data.releaseYear,
      imdbId: data.imdbId,
      mainActors: data.mainActors,
      imagePoster: data.imagePoster
    });

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Ok',
        data
      })
    }
  } catch (error) {
    console.log('error', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'There was an internal error'
      })
    };
  }
}
