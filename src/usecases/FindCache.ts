import { CacheRepository } from "../domain";
import { Cache } from "../domain/entities";

export class FindCache {
  constructor(
    private readonly cacheRepository: CacheRepository
  ) { }

  async execute(id: string): Promise<Cache | null> {
    return await this.cacheRepository.getById(id);
  }
}
