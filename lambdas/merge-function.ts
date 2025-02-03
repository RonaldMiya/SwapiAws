import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { IFilm, IFilmSwapi, IIMDb, IIMDbResponse } from "./types";

import axios, { AxiosResponse } from 'axios';
import { v4 as uuidV4 } from 'uuid';

const FILM_TABLE: string = process.env.FILM_TABLE || '';
const CACHE_MERGE_TABLE: string = process.env.CACHE_MERGE_TABLE || '';

const IMDBAPI: string = process.env.IMDBAPI || '';
const SWAPIAPI: string = process.env.SWAPIAPI || '';

// const CACHE_TTL: number = 2 * 60 * 1000;
const dynamoDB: DynamoDB = new DynamoDB();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id: string | undefined = event.pathParameters?.id

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Se necesita el id de la película' })
    }
  }

  let film: IFilm | null = await getCache(id);

  if (!film) {
    film = await fetchFromAPIs(id);
    putStoreInCache(id, film)
  }

  try {
    await storeFilm(film);
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'There was an internal error.' })
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: film
    })
  };
}

async function getCache(key: string): Promise<IFilm | null> {
  const params = {
    TableName: CACHE_MERGE_TABLE,
    Key: {
      cacheKey: key
    }
  }

  const result = await dynamoDB.send(
    new GetCommand(params)
  );

  if (!result.Item) {
    return null;
  }

  return null;
}

async function fetchFromAPIs(id: string): Promise<IFilm | null> {
  let film: IFilm | null = null;

  try {
    const response: AxiosResponse<IFilmSwapi> = await axios.get(`${SWAPIAPI}/api/films/${id}`);
    const result: IFilmSwapi | null = response.data || null;

    if (result) {
      film = {
        title: result.title,
        episodeId: result.episode_id,
        openingCrawl: result.opening_crawl,
        director: result.director,
        producer: result.producer,
        releaseDate: result.release_date
      }
    }
  } catch (error) {
    console.log('error swapi', error);
    return null;
  }

  if (!film) {
    return null;
  }

  try {
    const response: AxiosResponse<IIMDbResponse> = await axios.get(`${IMDBAPI}/search?q=${film.title}`);
    const result: IIMDb | null = response.data?.description[0] || null;

    if (result) {
      film.fullName = result['#TITLE']
      film.imdbId = result['#IMDB_ID']
      film.mainActors = result['#ACTORS']
      film.imagePoster = result['#IMG_POSTER']
    }
  } catch (error) {
    console.log('error imdb', error);
  }

  return film;
}

async function putStoreInCache(key: string, data: any) {
  const params = {
    TableName: CACHE_MERGE_TABLE,
    Item: {
      cacheKey: key,
      data,
      timestamp: Date.now(),
      ttl: Math.floor(Date.now() / 1000) + 30 * 60 // Cache 30 mins
    },
  };

  try {
    await dynamoDB.send(
      new PutCommand(params)
    );
  } catch (error) {
    console.error('Error al almacenar en cache:', error);
  }
}

async function storeFilm(data: any) {
  const id = uuidV4();

  const params = {
    TableName: FILM_TABLE,
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
    console.error('Error al almacenar en Film:', error);
  }
}
