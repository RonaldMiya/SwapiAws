import { v4 as uuid } from 'uuid';
import { Cache } from '../domain/entities';
import { CacheRepository } from '../domain/repositories';

interface Input {
  data: any;
}

export class CreateCache {
  constructor(
    private readonly cacheRepository: CacheRepository
  ) { }

  async execute(input: Input): Promise<Cache> {
    const ttl = Math.floor(Date.now() / 1000) + 30 * 60; // 30 mins cache

    return await this.cacheRepository.create(new Cache(
      uuid(),
      input.data,
      Date.now(),
      ttl
    ))
  }
}
