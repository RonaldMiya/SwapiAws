export class Cache {
  constructor(
    readonly cacheKey: string,
    readonly data: any,
    readonly timestmap: number,
    readonly ttl: number
  ) { }
}
