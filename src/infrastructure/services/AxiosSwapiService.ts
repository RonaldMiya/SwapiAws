import axios, { AxiosResponse } from "axios";

import { SwapiService } from "../../domain/services/SwapiService";

export class AxiosSwapiService implements SwapiService {
  private swapiURL: string;
  private imDBURL: string;

  constructor(swapiURL: string, imDBURL: string) {
    this.swapiURL = swapiURL;
    this.imDBURL = imDBURL;
  }

  async fetchDataFromApi(id: string): Promise<any> {
    let data: any = {};

    try {
      const response: AxiosResponse<any> = await axios.get(`${this.swapiURL}/api/films/${id}`);
      const result: any | null = response.data || null;

      if (result) {
        data = {
          title: result.title,
          episodeId: result.episode_id,
          openingCrawl: result.opening_crawl,
          director: result.director,
          producer: result.producer,
          releaseDate: result.release_date
        }
      }
    } catch (error) {
      console.log('not exists film', error);
      return null;
    }

    if (!data) {
      return null;
    }

    try {
      const response: AxiosResponse<any> = await axios.get(`${this.imDBURL}/search?q=${data.title}`);
      const result: any | null = response.data?.description[0] || null;

      if (result) {
        data.fullName = result['#TITLE']
        data.imdbId = result['#IMDB_ID']
        data.mainActors = result['#ACTORS']
        data.imagePoster = result['#IMG_POSTER']
      }
    } catch (error) {
      console.log('not exists imdb', error);
    }

    return data;
  }
}
