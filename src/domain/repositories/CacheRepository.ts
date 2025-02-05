import { Cache } from "../entities";

export interface CacheRepository {
  getById(id: string): Promise<Cache | null>;
  create(user: Cache): Promise<Cache>;
}
