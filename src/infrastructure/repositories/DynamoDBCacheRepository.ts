import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";

import { CacheRepository } from "../../domain";
import { Cache } from "../../domain/entities";

export class DynamoDBCacheRepository implements CacheRepository {
  private client: DynamoDB;
  private tableName: string;

  constructor(client: DynamoDB, tableName: string) {
    this.client = client;
    this.tableName = tableName;
  }

  async getById(id: string): Promise<Cache | null> {
    const command = new GetCommand({ TableName: this.tableName, Key: { cacheKey: id } });
    const result = await this.client.send(command);

    const item = result.Item ? this.convertItemToCache(result.Item) : null;

    return item;
  }

  async create(cache: Cache): Promise<Cache> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: cache
    });

    await this.client.send(command);

    return cache;
  }

  private convertItemToCache(item: any): Cache {
    return new Cache(
      item.cacheKey,
      item.data,
      item.timestamp,
      item.ttl
    );
  }
}
