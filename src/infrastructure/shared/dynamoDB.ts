import { DynamoDB } from "@aws-sdk/client-dynamodb";

export class DynamoDatabase {
  private static client: DynamoDB;

  static async connect(): Promise<boolean> {
    if (!this.client) {
      try {
        this.client = new DynamoDB({});
        return true;
      } catch (error) {
        console.error("Error connect to DynamoDB:", error);
        return false;
      }
    }

    return true;
  }

  static getClient(): DynamoDB {
    if (!this.client) {
      throw new Error(
        "DynamoDB client is not initialized."
      );
    }

    return this.client;
  }
}
