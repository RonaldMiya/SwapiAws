import { HashService } from "../../domain/services/HashService";
import { EncryptCommand, KMSClient } from '@aws-sdk/client-kms';

export class KMSHashService implements HashService {
  private client: KMSClient;
  private keyId: string;

  constructor(client: KMSClient, keyId: string) {
    this.client = client;
    this.keyId = keyId;
  }

  async hash(password: string): Promise<string> {
    const command = new EncryptCommand({
      KeyId: this.keyId,
      Plaintext: Buffer.from(password)
    });

    const encryptedData = await this.client.send(command);
    const hashedPassword = encryptedData.CiphertextBlob ? (encryptedData.CiphertextBlob as Buffer).toString('base64') : '';

    console.log('hashed Pass', hashedPassword);
    console.log('type', typeof hashedPassword);

    return hashedPassword;
  }

  // async compare(password: string, hash: string): Promise<boolean> {

  // }
}
