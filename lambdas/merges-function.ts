import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import axios, { AxiosResponse } from 'axios';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const page: string = event.queryStringParameters?.page || '1'
  let filmList: Array<any> = [];

  console.log('page', page);

  try {
    const response: AxiosResponse = await axios.get(`https://swapi.dev/api/films?page=${page}`);
    const results: Array<any> = response.data?.results || [];

    filmList = results.map((item: any) => ({
      title: item.title,
      episodeId: item.episode_id,
      openingCrawl: item.opening_crawl,
      director: item.director,
      producer: item.producer,
      releaseDate: item.release_date
    }));
  } catch (error) {
    console.log('error swapi', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Se ha producido un error' })
    }
  }

  console.log('filmList 1', filmList);

  if (filmList.length < 1) {
    return {
      statusCode: 200,
      body: JSON.stringify({ data: [] })
    }
  }

  try {
    for (let i = 0; i < filmList.length; i++) {
      const film: any = filmList[i];
      const response: AxiosResponse = await axios.get(`https://imdb.iamidiotareyoutoo.com/search?q=${film.title}`);
      const result: any | null = response.data?.description[0] || null;

      if (!result) {
        continue;
      }

      filmList[i]['fullName'] = result['#TITLE']
      filmList[i]['releaseYear'] = result['#YEAR']
      filmList[i]['imdbId'] = result['#IMDB_ID']
      filmList[i]['mainActors'] = result['#ACTORS']
      filmList[i]['imagePoster'] = result['#IMG_POSTER']
    }
  } catch (error) {
    console.log('error imdb', error);
  }

  console.log('filmList 2', filmList);

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: filmList,
      message: 'Te quiero mucho mamita'
    })
  };
}
