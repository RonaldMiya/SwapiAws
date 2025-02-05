import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";

import { FilmRepository } from "../../domain";
import { Film } from "../../domain/entities";

export class DynamoDBFilmRepository implements FilmRepository {
  private client: DynamoDB;
  private tableName: string;

  constructor(client: DynamoDB, tableName: string) {
    this.tableName = tableName;
    this.client = client;
  }

  async getAll(): Promise<{ items: Film[]; total: number; }> {
    const command = new ScanCommand({ TableName: this.tableName });
    const result = await this.client.send(command);

    const items = result.Items?.map((item) => this.convertItemToFilm(item)) || [];
    const total = items.length;

    return {
      items,
      total
    }
  }

  async create(film: Film): Promise<Film> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: film
    });

    await this.client.send(command);

    return film;
  }

  private convertItemToFilm(item: any): Film {
    return new Film(
      item.id,
      item.title,
      item.episodeId,
      item.openingCrawl,
      item.director,
      item.producer,
      item.releaseDate,
      item.fullName,
      item.releaseYear,
      item.imdbId,
      item.mainActors,
      item.imagePoster,
      item.timestamp
    );
  }
}
