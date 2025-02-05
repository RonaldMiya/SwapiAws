import { Cache } from "../entities";

export interface CacheService {
  getCache(key: string): Promise<any | null>;
  setCache(data: any): Promise<void>;
}
