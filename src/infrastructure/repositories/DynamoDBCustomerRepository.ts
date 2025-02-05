import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";

import { UserRepository } from "../../domain";
import { User } from "../../domain/entities";

export class DynamoDBUserRepository implements UserRepository {
  private client: DynamoDB;
  private tableName: string;

  constructor(client: DynamoDB, tableName: string) {
    this.tableName = tableName;
    this.client = client;
  }

  async create(user: User): Promise<User> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: user
    });

    await this.client.send(command);

    return user;
  }

  private convertItemToUser(item: any): User {
    return new User(
      item.id,
      item.name,
      item.lastName,
      item.email,
      item.password,
      item.confirmed,
      item.timestamp
    );
  }
}
