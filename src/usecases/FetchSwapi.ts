import { Cache } from "../domain/entities";
import { CacheService } from "../domain/services/CacheService";
import { SwapiService } from "../domain/services/SwapiService";

interface SwapiResponse {
  title: string
  episodeId: number
  openingCrawl: string
  director: string
  producer: string
  releaseDate: string
  fullName: string
  releaseYear: string
  imdbId: string
  mainActors: string
  imagePoster: string
}

export class FetchSwapi {
  constructor(
    private cacheService: CacheService,
    private swapiService: SwapiService
  ) { }

  async execute(id: string): Promise<SwapiResponse | null> {
    let data = await this.cacheService.getCache(id);

    if (data) {
      return data;
    }

    data = await this.swapiService.fetchDataFromApi(id);

    if (data) {

      const ttl = Math.floor(Date.now() / 1000) + 30 * 60; // 30 mins cache

      const cacheData = new Cache(
        id,
        data,
        Date.now(),
        ttl
      )

      await this.cacheService.setCache(cacheData);

      return data;
    }

    return null;
  }
}
