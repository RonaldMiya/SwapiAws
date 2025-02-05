import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

import { Cache } from "../../domain/entities";
import { CacheService } from "../../domain/services/CacheService";

export class DynamoDBCacheService implements CacheService {
  private client: DynamoDB;
  private tableName: string;

  constructor(client: DynamoDB, tableName: string) {
    this.client = client;
    this.tableName = tableName;
  }

  async getCache(key: string): Promise<any | null> {
    const command = new GetCommand({ TableName: this.tableName, Key: { cacheKey: key } });
    const result = await this.client.send(command);

    const data = result.Item ? result.Item.data : null;
    return data;
  }

  async setCache(data: Cache): Promise<void> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: data
    });

    await this.client.send(command);
  }
}
